import { Injectable,ForbiddenException,NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCommentDto } from './create-comment.dto.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentService {
    constructor(private prisma:PrismaService){}
    async createComment(
    dto: CreateCommentDto,
    user: {
      id: number;
      email: string;
      role: string;
    },
  ) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: dto.taskId,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (
      user.role !== 'ADMIN' &&
      task.assignedToId !== user.id
    ) {
      throw new ForbiddenException(
        'You are not assigned to this task',
      );
    }

    return this.prisma.comment.create({
      data: {
        content: dto.content,
        taskId: dto.taskId,
        userId: user.id,
      },
    });
  }

    async getComments(
        taskId: number,
        user: {
            id: number;
            email: string;
            role: string;
        },
        ) {
        const task = await this.prisma.task.findUnique({
            where: {
            id: taskId,
            },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        if (
            user.role !== 'ADMIN' &&
            task.assignedToId !== user.id
        ) {
            throw new ForbiddenException(
            'You are not assigned to this task',
            );
        }

        return this.prisma.comment.findMany({
            where: {
            taskId,
            },
            include: {
            user: {
                select: {
                id: true,
                email: true,
                role: true,
                },
            },
            },
            orderBy: {
            createdAt: 'asc',
            },
        });
    }

    async deleteComment(
        id: number,
        user: {
            id: number;
            email: string;
            role: string;
        },
        ) {
        const comment = await this.prisma.comment.findUnique({
            where: {
            id,
            },
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        if (
            user.role !== 'ADMIN' &&
            comment.userId !== user.id
        ) {
            throw new ForbiddenException(
            'You can only delete your own comments',
            );
        }

        const deletedComment = await this.prisma.comment.delete({
            where: {
            id,
            },
        });

        return {
            message: 'Comment deleted successfully',
            comment: deletedComment,
        };
    }

}
