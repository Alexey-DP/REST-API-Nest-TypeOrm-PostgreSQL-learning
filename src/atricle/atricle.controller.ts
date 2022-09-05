import { BackemdValidationPipe } from './../shared/pipes/backendValidation.pipe';
import { UpdateArticleDto } from './dto/update-article.dto';
import { IArticleResponse } from './interfaces/articleResponse.interface';
import { CreateArticleDto } from './dto/create-article.dto';
import { UserEntity } from '@app/user/entities/user.entity';
import { AuthGuard } from './../user/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AtricleService } from './atricle.service';
import { User } from '@app/user/decorators/user.decorator';
import { IAllArticlesResponse } from './interfaces/allArticlesResponse';

@Controller('articles')
export class AtricleController {
  constructor(private readonly atricleService: AtricleService) {}

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<IAllArticlesResponse> {
    return await this.atricleService.findAll(currentUserId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<IAllArticlesResponse> {
    return await this.atricleService.getFeed(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackemdValidationPipe())
  async createArticle(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const newArticle = await this.atricleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.atricleService.buildArticleResponce(newArticle);
  }

  @Get(':slug')
  async getArticleBySlug(
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.atricleService.getArticleBySlug(slug);
    return this.atricleService.buildArticleResponce(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async removeArticleBySlug(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    return await this.atricleService.removeArticle(currentUserId, slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new BackemdValidationPipe())
  async updateArticleBySlug(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<IArticleResponse> {
    const updatedArticle = await this.atricleService.updateArticleBySlug(
      currentUserId,
      slug,
      updateArticleDto,
    );
    return this.atricleService.buildArticleResponce(updatedArticle);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User('id') currendUserId: number,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.atricleService.addArticleToFavorites(
      currendUserId,
      slug,
    );
    return this.atricleService.buildArticleResponce(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async removeArticleFromFavorites(
    @User('id') currendUserId: number,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.atricleService.removeArticleFromFavorites(
      currendUserId,
      slug,
    );
    return this.atricleService.buildArticleResponce(article);
  }
}
