import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  async getBoards(userId: number, stringifyIds: boolean) {
    const user = await this.userRepository.findOne({where: {id: userId}, relations: [
        'boards',
        'boards.lists',
        'boards.lists.cards',
      ]});

    if (user){
      return user.boards.map((board) => ({
        ...board,
        lists: board.lists.map((list) => ({
          ...list,
          id: stringifyIds ? String(list.id) : list.id,
          cards: list.cards.map((card) => ({
            ...card,
            id: stringifyIds ? String(card.id) : card.id,
          })).sort((a, b) => a.position - b.position),
        })).sort((a, b) => a.position - b.position)
      }))
    }
    throw new NotFoundException('User not found');
  }

  async getSharedBoards(userId: number, stringifyIds: boolean){
    const user = await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.sharedWithMe', 'sharedWithMe')
        .leftJoinAndSelect('sharedWithMe.board', 'board')
        .leftJoinAndSelect('board.lists', 'lists')
        .leftJoinAndSelect('lists.cards', 'cards')
        .leftJoin('board.user', 'owner')
        .addSelect('owner.username')
        .where('user.id = :userId', { userId }) .getOne();

    if (user && user.sharedWithMe){
      return user.sharedWithMe.map((shared) => ({
        ...shared,
        board: {
          ...shared.board,
          lists: shared.board.lists.map((list) => ({
            ...list,
            id: stringifyIds ? String(list.id) : list.id,
            cards: list.cards.map((card) => ({
              ...card,
              id: stringifyIds ? String(card.id) : card.id
            })).sort((a, b) => a.position - b.position),
          })).sort((a, b) => a.position - b.position)
        }
      }));
    }
    throw new NotFoundException('User not found or user does not have shared boards');
  }

  async getBoard(userId: number, boardId: number) : Promise<any> {
    const user = await this.userRepository.findOne({where: {id: userId},
      relations: [
          'boards',
          'boards.lists',
          'boards.lists.cards',
          'sharedWithMe',
          'sharedWithMe.board',
          'sharedWithMe.board.lists',
          'sharedWithMe.board.lists.cards',
      ] });

    if (!user) throw new NotFoundException('User not found');

    let board = user.boards.find((board) => board.id === +boardId);

    if (!board)
      board = user.sharedWithMe.find((shared) => shared.board.id === +boardId).board;

    if (board && board.lists) {
      return board;
    }

    throw new NotFoundException('Board bot found');
  }

  async getFirstBoardLists(userId: number) : Promise<any> {
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['boards']});

    if (user){
      return await this.getBoard(userId, user.boards[0].id)
    }

    throw new NotFoundException('User not found');
  }

  async addList(userId: number, listDto: CreateListDto): Promise<any> {

    const user = await this.userRepository.findOne({where: {id: userId}, relations: [
			'boards',
			'sharedWithMe',
			'sharedWithMe.board'
		] });
    const existingList = await this.listRepository.findOne({where: {
      name: listDto.name
      },
      relations: [
          'board',
          'board.user'
      ]});

    if (existingList && existingList.board.user.id === userId && existingList.board.id === +listDto.boardId) {
      throw new ConflictException("List already exists");
    }

    if (user){
      let board = user.boards.find((board) => board.id === listDto.boardId);

      if (!board){
        board = user.sharedWithMe.find((shared) => shared.board.id === listDto.boardId).board
        if (!board) throw new ConflictException("Board does not exist");
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
    const userWhoSharing = await this.userRepository.findOne({where: {id: userId}, relations: [
          'boards',
          'meShared',
          'meShared.userSharedWith'
      ]});

    if (userWhoSharing){
      if (userWhoSharing.email === email)
		  throw new ConflictException('You can\'t share a board with yourself');
	  if (!userWhoSharing.boards.find((board) => board.id === +boardId))
		  throw new NotFoundException('Board not found');
	  if (userWhoSharing.meShared.find((shared) => shared.userSharedWith.email === email))
		  throw new ConflictException('This user is already using this board');
    }else{
		throw new NotFoundException('User not found');
	}

    const token = this.jwtService.sign({ id: userId, email: email, boardId: boardId });
    const url = `http://localhost:5173/confirm-board-sharing/${token}`;

    const html = `
    <!DOCTYPE html> 
      <html lang='en'> 
        <body> 
          <h1>Accept board sharing</h1> 
          <p>Click the following link to accept:</p> 
          <a href="${url}">Accept</a> 
        </body> 
      </html> `;
    await this.mailerService.sendEmail(email, 'Board Sharing', html)
  }

  async confirmBoardSharing(userId: number, token: string){
    try{
      const payload = this.jwtService.verify(token);
      const {id, email, boardId} = payload;
      const userWhoSharing = await this.userRepository.findOne({where: {id: id}, relations: ['boards']});
      const userToShare = await this.userRepository.findOne({where: {email: email}});

      if (!userToShare){
        return {success: false, message: 'User to share is not registered'}
      }
      if (userToShare.id !== userId){
        return {success: false, message: 'Cannot confirm someone else\'s request'};
      }

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
