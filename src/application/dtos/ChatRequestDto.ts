import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ChatRequestDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  question!: string;
}
