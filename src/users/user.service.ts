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
import * as bcrypt from 'bcrypt';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(userData: CreateUserDto) {
    const user = this.usersRepository.create({ ...userData });
    await this.usersRepository.save(user);
    return user;
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
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
    //Check if user exists
    const user = await this.getById(userid);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //Update the user
    await this.usersRepository.update(user.id, editdata);

    //Return the updated user
    return this.getById(userid);
  }

  // Delete a specific user
  async deleteUser(userId: number) {
    //Check if user exixts
    const user = await this.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Deletes the user from the database
    const deleteduser = await this.usersRepository.delete(user.id);
    return deleteduser;
  }

  getAllAddressesWithUsers() {
    return this.usersRepository.find({ relations: ['address'] });
  }

  async setCurrentRefreshToken(token: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(token, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfTokenMatches(token: string, userId: number) {
    const user = await this.getById(userId);
    const ismatch = await bcrypt.compare(token, user.currentHashedRefreshToken);
    if (ismatch) return user;
  }
}
