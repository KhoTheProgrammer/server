import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/Decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/Guard/jwt.guard';
import User from './user.entity';
import { EdituserDto } from './dto/edituser.dto';
import UserService from './user.service';
@Controller('users')
export class UsersController {
  constructor(
    private userservice: UserService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  editUser(@GetUser() user: User, @Body() editdata: EdituserDto) {
    const updateduser = this.userservice.editUser(user.id, editdata);
    return updateduser;
  }

  @Get()
  async getAllUsers() {
    return this.userservice.getAllusers();
  }

  @UseGuards(JwtGuard)
  @Delete('me/:id')
  async deleteUser(@Param() id: number) {
    return this.userservice.deleteUser(id);
  }

  @Get('address')
  async getAlladdressesWithUsers() {
    return this.userservice.getAllAddressesWithUsers();
  }
}
