import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty({ message: `Title can't be empti` })
  readonly title: string;

  @IsNotEmpty({ message: `Description can't be empti` })
  readonly description: string;

  @IsNotEmpty({ message: `Body can't be empti` })
  readonly body: string;

  readonly tagList?: string[];
}
