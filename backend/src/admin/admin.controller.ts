import { Controller, Get, UseGuards } from '@nestjs/common';

import { AdminService } from './admin.service.js';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard.js';

import { RolesGuard } from '../auth/guard/roles.guard.js';

import { Roles } from '../auth/decorator/roles.decorator.js';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }
}