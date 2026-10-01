'use client';

import { useEffect, useState } from 'react';
import { getProjects,getTasks } from '@/src/lib/api';
import type { Project,Task } from '@/src/types';
import ProjectCard from '@/src/components/ProjectCard';
import LogoutButton from '@/src/components/LogoutButton';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projectsData, tasksData] = await Promise.all([
          getProjects(),
          getTasks(),
        ]);

        setProjects(projectsData);
        setTasks(tasksData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0d0f1a] text-white flex items-center justify-center">
        <p className="text-gray-400">Loading projects...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0f1a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold">
            My Projects
          </h1>
          <LogoutButton />

          <p className="mt-1 text-sm text-slate-400">
            {projects.length} project
            {projects.length !== 1 ? 's' : ''} assigned
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const projectTasks = tasks.filter(
              (task) => task.projectId === project.id
            );

            return (
              <ProjectCard
                key={project.id}
                project={project}
                tasks={projectTasks}
              />
            );
          })}
        </div>

      </div>
    </main>
  );
}