import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/Decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/Guard/jwt.guard';
import User from './user.entity';
import { EdituserDto } from './dto/edituser.dto';
import UserService from './user.service';

@Controller('users')
export class UsersController {
  constructor(private userservice: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  editUser(@Param('id') id: string, @Body() editdata: EdituserDto) {
    const user = this.userservice.editUser(Number(id), editdata);
    return user;
  }

  @Get()
  async getAllUsers() {
    return this.userservice.getAllusers();
  }
}
