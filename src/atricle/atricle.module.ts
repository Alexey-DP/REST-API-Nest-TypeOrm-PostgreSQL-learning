import { FollowEntity } from './../profile/entities/follow.entity';
import { Module } from '@nestjs/common';
import { AtricleService } from './atricle.service';
import { AtricleController } from './atricle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/entities/user.entity';
import { ArticleEntity } from './entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ArticleEntity, FollowEntity]),
  ],
  controllers: [AtricleController],
  providers: [AtricleService],
})
export class AtricleModule {}
