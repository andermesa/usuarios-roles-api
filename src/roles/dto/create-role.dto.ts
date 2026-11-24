
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'role_name es requerido' })
  @MaxLength(50)
  role_name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}



