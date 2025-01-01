import { CreateUserDto } from 'src/users/dto';
import { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './tokenPayload.interface';
import UserService from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(signupdata: CreateUserDto) {
    //generate the password hash
    const hash = await bcrypt.hash(signupdata.password, 10);

    //save the new user in the db
    const user = this.userService.create({ ...signupdata, password: hash });
    (await user).password = undefined;

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
    //return token
    return this.signToken(user.id, user.email);
  }

  //Generate json web token
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRATION_TIME'),
    });

    return {
      access_token: token,
    };
  }

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Aunthentication=${token}; HttpOnly; Path=/; Max-age=${this.config.get('JWT_EXPIRATION_TIME')}s`;
  }

  public getCookieWithRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const Refreshtoken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.config.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });
    const RefreshCookie = `Refresh=${Refreshtoken}; HttpOnly; Path=/; Max-age=${this.config.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`;
    return {
      RefreshCookie,
      Refreshtoken,
    };
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.userService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  public async getUserFromAuthToken(token: string) {
    const payload: TokenPayload = this.jwtService.verify(token, {
      secret: this.config.get('JWT_SECRET'),
    });
    if (payload.userId) {
      return this.userService.getById(payload.userId);
    }
  }
}
