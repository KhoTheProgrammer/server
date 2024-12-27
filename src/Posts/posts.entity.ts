import { Transform } from 'class-transformer';
import Category from '../Category/category.entity';
import User from '../users/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Column({ nullable: true })
  @Transform(({ value }) => {
    if (value !== null) {
      return value;
    }
  })
  public category?: string;

  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User

  @ManyToMany(() => Category)
  @JoinTable()
  public categories: Category[]
}

export default Post;
