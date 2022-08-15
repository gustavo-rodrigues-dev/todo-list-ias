import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

const MINIMAL_TEXT = 3;
export class TaskDTO {
  @ApiProperty({
    title: 'My Todo Id',
    readOnly: true,
  })
  id?: string;
  @ApiProperty({
    example: 'My Todo title',
  })
  @IsNotEmpty()
  @IsString()
  @Length(MINIMAL_TEXT)
  title: string;
  @ApiProperty({
    example: 'My Todo description',
  })
  @IsNotEmpty()
  @IsString()
  @IsString()
  @Length(MINIMAL_TEXT)
  description: string;
  @ApiProperty({
    example: ['picture1.jpg'],
  })
  attachments?: [string];
  @ApiProperty({
    example: '2022-04-08T06:51:13-03:00',
  })
  createdAt?: string;
  @ApiProperty({
    example: '2022-04-08T06:51:13-03:00',
  })
  updatedAt?: string;

  @ApiProperty({
    example: true,
  })
  done?: boolean;
}
