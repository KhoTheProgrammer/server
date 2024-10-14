import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './user.entity';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email: email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDto) {
    const user = this.usersRepository.create({...userData});
    await this.usersRepository.save(user);
    return user;
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (user){
      return user
    }
    throw new HttpException("User with this id does not exist", HttpStatus.NOT_FOUND)
  }
}