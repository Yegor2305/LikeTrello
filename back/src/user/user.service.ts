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

  async getLists(userId: number) : Promise<List[]> {
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['lists', 'lists.cards'] });

    if (user && user.lists){
      return user.lists;
    }

    throw new NotFoundException();
  }

  async addList(userId: number, listDto: CreateListDto): Promise<any> {
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['lists'] });

    if (user){
      if (user.lists.findIndex(list => list.name === listDto.name) != -1){
        throw new ConflictException("Place already added to user");
      }

      const list = this.listRepository.create({
        name: listDto.name,
        cards: [],
        user: user,
      });

      await this.listRepository.save(list);

      user.lists.push(list);
    }

    return user.lists;
  }

}
