import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto';
import User from './user.entity';
import { EdituserDto } from './dto/edituser.dto';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email: email });
    return user;
  }

  async create(userData: CreateUserDto) {
    const user = this.usersRepository.create({ ...userData });
    await this.usersRepository.save(user);
    return user;
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAllusers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  async editUser(userid: number, editdata: EdituserDto) {
    const user = await this.getById(userid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
   
    await this.usersRepository.update(user.id, editdata);

    return user;
  }
}
