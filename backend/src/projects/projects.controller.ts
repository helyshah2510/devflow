import { Body,Controller,Get,Post,Req,UseGuards,Param,ParseIntPipe,Patch,Delete,} from '@nestjs/common';
import { Request } from 'express';
import { ProjectsService } from './projects.service.js';
import { CreateProjectDto } from './create-project.dto.js';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guard/roles.guard.js';
import { Roles } from '../auth/decorator/roles.decorator.js';
import { UpdateProjectDto } from './update-project.dto.js';

type AuthenticatedRequest = Request & {
  user: {
    id: number;
    email: string;  
    role: string;
  };
};

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getProjects(@Req() req:AuthenticatedRequest) {
    return this.projectsService.getProjects(req.user);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN')
  @Post()
  createProject(
    @Body() dto: CreateProjectDto,
    @Req() req: AuthenticatedRequest,
  ) {
        return this.projectsService.createProject(dto, req.user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Patch(':id')
    updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
    ) {
        return this.projectsService.updateProject(id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    deleteProject(
    @Param('id', ParseIntPipe) id: number,
    ) {
        return this.projectsService.deleteProject(id);
    }
}