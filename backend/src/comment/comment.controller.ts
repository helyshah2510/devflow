import { Body, UseGuards, Post, Controller, Req, Get, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard.js';
import { CommentService } from './comment.service.js';
import { Request } from 'express';
import { CreateCommentDto } from './create-comment.dto.js';

type AuthenticatedRequest = Request & {
  user: {
    id: number;
    email: string;
    role: string;
  };
};

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createComment(
    @Body() dto: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.commentService.createComment(dto, req.user);
  }

  @Get('task/:taskId')
  @UseGuards(JwtAuthGuard)
  getComments(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.commentService.getComments(taskId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.commentService.deleteComment(id, req.user);
  }
}
