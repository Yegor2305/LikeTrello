import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateListDto} from "../list/dto/create-list.dto";
import {List} from "../list/entities/list.entity";

@Injectable()
export class UserService {

  constructor(
      @InjectRepository(User) private readonly userRepository : Repository<User>,
      @InjectRepository(List) private readonly listRepository : Repository<List>,
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
          'boards.lists.board',
          'boards.lists.cards',
      ] });

    if (!user) throw new NotFoundException('User not found');

    const board = user.boards.find((board) => board.id === +boardId);

    if (board && board.lists) {
      return board.lists;
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

}
