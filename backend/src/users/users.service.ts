import { Injectable, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }
    async createUser(email: string, password: string) {
        return this.prisma.user.create({
            data: {
                email,
                password
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async getMembers() {
        return this.prisma.user.findMany({
            where: { role: 'MEMBER' ,isActive: true},
            select: {
                id: true,
                email: true,
                role: true,
            },
        });
    }

    async getAllUsers() {
        return this.prisma.user.findMany({
            select: { id: true, email: true, role: true, isActive: true },
            orderBy: { id: 'asc' },
        });
    }

    async updateRole(id: number, role: 'ADMIN' | 'MEMBER', currentUserId: number) {
        if (id === currentUserId) {
            throw new ForbiddenException('You cannot change your own role');
        }

        const target = await this.prisma.user.findUnique({
            where: { id },
            select: { isActive: true },
        });

        if (!target) {
            throw new NotFoundException('User not found');
        }

        if (!target.isActive) {
            throw new ConflictException(
                'Activate this user before changing their role',
            );
        }

        return this.prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, email: true, role: true, isActive: true },
        });
    }

    async setActive(id: number, isActive: boolean, currentUserId: number) {
        if (id === currentUserId) {
            throw new ForbiddenException('You cannot deactivate your own account');
        }

        try {
            return await this.prisma.user.update({
                where: { id },
                data: { isActive },
                select: { id: true, email: true, role: true, isActive: true },
            });
        } catch (error) {
            if ((error as { code?: string }).code === 'P2025') {
                throw new NotFoundException('User not found');
            }
            throw error;
        }
    }
}
