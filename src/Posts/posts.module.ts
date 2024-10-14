import { Module } from '@nestjs/common';
import PostsController from './posts.controller';
import PostsService from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from './posts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService]  // Make PostsService available to other modules for dependency injection
})
export class PostsModule {}
