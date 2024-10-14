import { Body, Controller, Post } from '@nestjs/common';
import PostsService from 'src/posts/posts.service';
import { CreateUserDto } from 'src/users/dto';
import UserService from 'src/users/user.service';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';


@Controller('auth')
export class AuthController {
  constructor(
    private postservice: PostsService,
    private usersService: UserService,
    private authservice: AuthService
  ) {}
  @Post('signup')
  signup(@Body() signupdata: CreateUserDto) {
    console.log(signupdata);
    return this.authservice.signup(signupdata);
  }

  @Post('signin')
  signin(@Body() signinata: SigninDto){
    return this.authservice.signin(signinata);
  }
}
