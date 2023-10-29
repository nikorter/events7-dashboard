import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { EventType } from '../enums/EventType.enum';

export class CreateEventDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(EventType)
  type: EventType;

  @Min(0)
  @Max(10)
  @IsInt()
  priority: number;
}
