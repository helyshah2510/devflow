import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const totalUsers = await this.prisma.user.count();

    const totalProjects = await this.prisma.project.count();

    const totalTasks = await this.prisma.task.count();

    const todoTasks = await this.prisma.task.count({
      where: {
        status: 'TODO',
      },
    });

    const inProgressTasks = await this.prisma.task.count({
      where: {
        status: 'IN_PROGRESS',
      },
    });

    const completedTasks = await this.prisma.task.count({
      where: {
        status: 'DONE',
      },
    });

    return {
      totalUsers,
      totalProjects,
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
    };
  }
}