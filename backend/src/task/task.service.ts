import { Injectable,ForbiddenException,NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './create-task.dto.js';
import { UpdateTaskDto } from './update-task.dto.js';
import { Prisma } from '@prisma/client';
import { UpdateTaskStatusDto } from './update-task-status.dto.js';

@Injectable()
export class TaskService {
    constructor(private prisma:PrismaService){}
    async createTask(
        dto: CreateTaskDto,
        user: {
        id: number;
        email: string;
        role: string;
        },
    ) {
        // Admin chooses freely. A member's task is always assigned to themselves.
        const assignedToId =
        user.role === 'ADMIN' ? dto.assignedToId : user.id;

        // 1. Find the project (and load its members)
        const project = await this.prisma.project.findUnique({
        where: {
            id: dto.projectId,
        },
        include: {
            members: {
                select: { id: true },
            },
        },
        });

        // 2. Project doesn't exist
        if (!project) {
        throw new NotFoundException('Project not found');
        }

        // 3. Check permission
        // ADMIN can create tasks in any project.
        // MEMBER can create tasks only in projects they are a member of.
        if (
        user.role !== 'ADMIN' &&
        !project.members.some((m) => m.id === user.id)
        ) {
        throw new ForbiddenException(
            'You are not assigned to this project',
        );
        }

        // 4. Create the task
        return this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                priority: dto.priority,
                projectId: dto.projectId,
                assignedToId,   
                createdById: user.id,
            },
        });
    }

    async getTasks(
        user: {
            id: number;
            email: string;
            role: string;
        },
        ) {
        if (user.role === 'ADMIN') {
            return this.prisma.task.findMany({
            include: {
                project: true,
                assignedTo:{
                    select:{
                        id:true,
                        email:true,
                        role:true,
                    },
                },
            },
            });
        }

        return this.prisma.task.findMany({
            where: {
                project: { members: { some: { id: user.id } } },
            },
            include: {
            project: true,
            assignedTo:{
                select:{
                    id:true,
                    email:true,
                    role:true,
                },
            },
            },
        });
    }
    
    async updateTask(id: number, dto: UpdateTaskDto) {
        try {
            return await this.prisma.task.update({
            where: {
                id,
            },
            data: {
                ...dto,
            },
            });
        } catch (error) {
            if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
            ) {
            throw new NotFoundException('Task not found');
            }

            throw error;
        }
    }

    async updateTaskStatus(
        id: number,
        dto: UpdateTaskStatusDto,
        user: {
            id: number;
            email: string;
            role: string;
        },
        ) {
        const task = await this.prisma.task.findUnique({
            where: {
            id,
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

        return this.prisma.task.update({
            where: {
            id,
            },
            data: {
            status: dto.status,
            },
        });
    }

    async deleteTask(id: number) {
        try {
            const task = await this.prisma.task.delete({
            where: {
                id,
            },
            });

            return {
            message: 'Task deleted successfully',
            task,
            };
        } catch (error) {
            if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
            ) {
            throw new NotFoundException('Task not found');
            }

            throw error;
        }
    }
    
}