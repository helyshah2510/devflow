import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto } from './create-project.dto.js';
import { Prisma } from '@prisma/client';
import { UpdateProjectDto } from './update-project.dto.js';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }
    getProjects(user: {
        id: number;
        email: string;
        role: string;
    }) {
        const include = {
            members: {
                select: { id: true, email: true, role: true, isActive: true },
            },
        };

        if (user.role === 'ADMIN') {
            return this.prisma.project.findMany({ include });
        }
        return this.prisma.project.findMany({
            where: {
                members: { some: { id: user.id } },
            },
            include,
        });
    }

    async createProject(
        dto: CreateProjectDto,
        user: {
            id: number;
            email: string;
            role: string;
        },
    ) {
        return this.prisma.project.create({
            data: {
                name: dto.name,
                description: dto.description,
                createdById: user.id,
                members: {
                    connect: dto.memberIds.map((id) => ({ id })),
                },
            },
        });
    }

    async updateProject(id: number, dto: UpdateProjectDto) {
        try {
            return await this.prisma.project.update({
                where: {
                    id,
                },
                data: {
                    ...(dto.name !== undefined ? { name: dto.name } : {}),
                    ...(dto.description !== undefined
                        ? { description: dto.description }
                        : {}),
                    ...(dto.memberIds !== undefined
                        ? { members: { connect: dto.memberIds.map((id) => ({ id })) } }
                        : {}),
                },
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                throw new NotFoundException('Project not found');
            }

            throw error;
        }
    }

    async deleteProject(id: number) {
        try {
            const project = await this.prisma.project.delete({
                where: {
                    id,
                },
            });

            return {
                message: 'Project deleted successfully',
                project,
            };
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                throw new NotFoundException('Project not found');
            }

            throw error;
        }
    }
}
