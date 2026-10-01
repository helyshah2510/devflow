import { Controller, Get, UseGuards, Body, Param, ParseIntPipe, Patch, Req } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guard/roles.guard.js';
import { Roles } from '../auth/decorator/roles.decorator.js';
import { UpdateRoleDto } from '../auth/dto/update-role.dto.js';
import { UpdateStatusDto } from '../auth/dto/update-status.dto.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get()
  getUsers() {
    return this.usersService.getMembers();
  }

  @Get('all')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Patch(':id/role')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
    @Req() req: { user: { id: number } },
  ) {
    return this.usersService.updateRole(id, dto.role, req.user.id);
  }

  @Patch(':id/status')
  setStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
    @Req() req: { user: { id: number } },
  ) {
    return this.usersService.setActive(id, dto.isActive, req.user.id);
  }
}