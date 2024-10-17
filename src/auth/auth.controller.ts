import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';


@Controller('auth')
export class AuthController {
  constructor(
    private authservice: AuthService,
  ) {}
  @Post('signup')
  signup(@Body() signupdata: CreateUserDto) {
    console.log(signupdata);
    return this.authservice.signup(signupdata);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() signinata: SigninDto) {
    return this.authservice.signin(signinata);
  }
}
