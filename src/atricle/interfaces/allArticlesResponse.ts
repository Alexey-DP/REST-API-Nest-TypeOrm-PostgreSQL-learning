import { ArticleType } from './article.type';

export interface IAllArticlesResponse {
  articles: ArticleType[];
  articlesCount: number;
}
