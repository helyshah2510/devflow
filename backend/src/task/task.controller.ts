import { Controller, Body, Post, Req, UseGuards, Get, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service.js';
import { CreateTaskDto } from './create-task.dto.js';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard.js';
import { UpdateTaskDto } from './update-task.dto.js';
import { Roles } from '../auth/decorator/roles.decorator.js';
import { RolesGuard } from '../auth/guard/roles.guard.js';
import { UpdateTaskStatusDto } from './update-task-status.dto.js';


type AuthenticatedRequest = Request & {
  user: {
    id: number;
    email: string;
    role: string;
  };
};

@Controller('task')
export class TaskController {
  constructor(private taskService:TaskService){}

  @UseGuards(JwtAuthGuard)
  @Post()
  createProject(
    @Body() dto: CreateTaskDto,
    @Req() req: AuthenticatedRequest,
  ) {
      return this.taskService.createTask(dto, req.user);
    }

  @UseGuards(JwtAuthGuard)
  @Get()
  getTasks(@Req() req:AuthenticatedRequest){
    return this.taskService.getTasks(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.taskService.updateTask(id, dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.taskService.updateTaskStatus(
      id,
      dto,
      req.user,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.deleteTask(id);
  }
}
