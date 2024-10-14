import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/users/user.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [UserModule, PostsModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
