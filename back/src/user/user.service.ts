import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateListDto} from "../list/dto/create-list.dto";
import {List} from "../list/entities/list.entity";
import { MailerService } from '../mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { Shared } from '../shared/entities/shared.entity';

@Injectable()
export class UserService {

  constructor(
      @InjectRepository(User) private readonly userRepository : Repository<User>,
      @InjectRepository(List) private readonly listRepository : Repository<List>,
      @InjectRepository(Shared) private readonly sharedRepository : Repository<Shared>,
      private readonly mailerService: MailerService,
      private readonly jwtService: JwtService,

  ) {
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: {username} });
  }

  async getLists(userId: number, boardId: number) : Promise<any> {
    const user = await this.userRepository.findOne({where: {id: userId},
      relations: [
          'boards',
          'boards.lists',
          'boards.lists.cards',
      ] });

    if (!user) throw new NotFoundException('User not found');

    const board = user.boards.find((board) => board.id === +boardId);

    if (board && board.lists) {
      return board;
    }

    throw new NotFoundException('Board bot found');
  }

  async getFirstBoardLists(userId: number) : Promise<any> {
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['boards']});

    if (user){
      return await this.getLists(userId, user.boards[0].id)
    }

    throw new NotFoundException('User not found');
  }

  async addList(userId: number, listDto: CreateListDto): Promise<any> {
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['boards'] });
    const existingList = await this.listRepository.findOne({where: {
      name: listDto.name
      },
      relations: [
          'board',
          'board.user'
      ]});

    if (existingList && existingList.board.user.id === userId) {
      throw new ConflictException("List already exists");
    }

    if (user){
      const board = user.boards.find((board) => board.id === listDto.boardId);

      if (!board){
        throw new ConflictException("Board does not exist");
      }

      const list = this.listRepository.create({
        name: listDto.name,
        cards: [],
        board: board,
      });

      await this.listRepository.save(list);

      if (!board.lists) board.lists = [];

      board.lists.push(list);

      return true;
    }

  }

  async sendSharingEmail(userId: number, email: string, boardId: number){
    const userWhoSharing = await this.userRepository.findOne({where: {id: userId}, relations: ['boards']});
    if (userWhoSharing){
      if (userWhoSharing.email === email ||
          !userWhoSharing.boards.find((board) => board.id === +boardId)){
        throw new BadRequestException("An error in input data occurred");
      }
    }

    const token = this.jwtService.sign({ id: userId, email: email, boardId: boardId });
    const url = `http://localhost:3000/user/share-board-confirm?token=${token}`;
    
    const html = `
    <!DOCTYPE html> 
      <html lang='en'> 
        <body> 
          <h1>Confirm your email</h1> 
          <p>Please confirm your email by clicking the following link:</p> 
          <a href="${url}">Confirm Email</a> 
        </body> 
      </html> `;
    await this.mailerService.sendEmail(email, 'Board Sharing', html)
  }

  async confirmBoardSharing(token: string){
    try{
      const payload = this.jwtService.verify(token);
      const {id, email, boardId} = payload;
      const userWhoSharing = await this.userRepository.findOne({where: {id: id}, relations: ['boards']});
      const userToShare = await this.userRepository.findOne({where: {email: email}});
      const board = userWhoSharing.boards.find((board) => board.id === +boardId);

      const newSharedRelations = this.sharedRepository.create({
        userWhoShared: userWhoSharing,
        userSharedWith: userToShare,
        board: board,
      })

      await this.sharedRepository.save(newSharedRelations);

      if (!userWhoSharing.meShared) userWhoSharing.meShared = [];
      userWhoSharing.meShared.push(newSharedRelations);

      if (!userToShare.sharedWithMe) userToShare.sharedWithMe = [];
      userToShare.sharedWithMe.push(newSharedRelations);

      if (!board.shared) board.shared = [];
      board.shared.push(newSharedRelations);

      return {success: true};
    }
    catch (error){
      return {success: false, message: 'An error has occurred' };
    }
  }
}
