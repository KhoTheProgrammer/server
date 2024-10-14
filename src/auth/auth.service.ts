import { CreateUserDto } from 'src/users/dto';
import UserService from 'src/users/user.service';
import { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async signup(signupdata: CreateUserDto) {
    //generate the password hash
    const hash = await bcrypt.hash(signupdata.password, 10);

    //save the new user in the db
    const user = this.userService.create({ ...signupdata, password: hash });

    //return user
    return user;
  }

  async signin(signindata: SigninDto) {
    //find the user by email
    const user = await this.userService.getByEmail(signindata.email);

    // if user does not exist throw exception
    if (!user) {
      throw new HttpException('Incorrect credentials', HttpStatus.NOT_FOUND);
    }
    
    // compare password
    const ismatch = await bcrypt.compare(signindata.password, user.password);

    //if doesnt match throw an exception
    if (!ismatch) {
      throw new HttpException('Incorrect credentials', HttpStatus.NOT_FOUND);
    }
    //return user
    return user;
  }
}
