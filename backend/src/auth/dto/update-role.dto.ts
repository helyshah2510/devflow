import { IsIn } from 'class-validator';

export class UpdateRoleDto {
  @IsIn(['ADMIN', 'MEMBER'])
  role: 'ADMIN' | 'MEMBER';
}