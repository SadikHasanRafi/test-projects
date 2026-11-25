// DTO (Data Transfer Object): describes and validates the request body.
// Decorators come from class-validator. Checked by the global ValidationPipe.
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @Length(1, 100)
  title: string;

  @IsString()
  @Length(1, 100)
  author: string;

  @IsOptional() // may be missing or null
  @IsInt()
  @Min(0)
  @Max(2100)
  year?: number | null;
}
