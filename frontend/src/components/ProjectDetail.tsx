'use client';

import TaskCard from '@/src/components/TaskCard';
import TaskDetailPanel from '@/src/components/TaskDetailPanel';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { getProjects,getTasks } from '@/src/lib/api'; 
import type { Project,Task } from '@/src/types';
import CreateTaskModal from '@/src/components/CreateTaskModal';

interface ProjectDetailProps {  // add this
    backHref: string;
}

export default function ProjectDetail({ backHref }: ProjectDetailProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const params = useParams();

  const projectId = Number(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);

  useEffect(() => {
    async function loadProject() {
      try {
        const [projectsData, tasksData] = await Promise.all([
          getProjects(),
          getTasks(),
        ]);

        const selectedProject = projectsData.find(
          (project) => project.id === projectId
        );

        setProject(selectedProject || null);

        const projectTasks = tasksData.filter(
          (task) => task.projectId === projectId
        );

        setTasks(projectTasks);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d0f1a] text-white">
        <p className="text-slate-400">Loading project...</p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d0f1a] text-white">
        <p className="text-slate-400">
          Project not found.
        </p>
      </main>
    );
  }

  const todoTasks = tasks.filter(
    (task) => task.status === 'TODO'
  );

  const inProgressTasks = tasks.filter(
    (task) => task.status === 'IN_PROGRESS'
  );

  const doneTasks = tasks.filter(
    (task) => task.status === 'DONE'
  );

  return (
    <main className="min-h-screen bg-[#0d0f1a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Project Header */}
        <div className="mb-8">
            <Link
            href={backHref}
            className="text-sm text-slate-400 transition hover:text-white"
            >
                ← Back to Projects
            </Link>

          <div className="mt-5 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {project.name}
              </h1>

              <p className="mt-2 max-w-2xl text-slate-400">
                {project.description || 'No description provided.'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">
                {tasks.length} tasks
              </span>

              <button
                onClick={() => setShowCreateTask(true)}
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
              >
                + New Task
              </button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

          {/* TODO */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <h2 className="mb-4 font-semibold text-slate-300">
              TODO
            </h2>

            <div className="space-y-3">
              {todoTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setSelectedTask(task)}
                />
              ))}

              {todoTasks.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-500">
                  No tasks
                </p>
              )}
            </div>
          </div>

          {/* IN PROGRESS */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <h2 className="mb-4 font-semibold text-amber-400">
              IN PROGRESS
            </h2>

            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setSelectedTask(task)}
                />
              ))}

              {inProgressTasks.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-500">
                  No tasks
                </p>
              )}
            </div>
          </div>

          {/* DONE */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <h2 className="mb-4 font-semibold text-emerald-400">
              DONE
            </h2>

            <div className="space-y-3">
              {doneTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setSelectedTask(task)}
                />
              ))}

              {doneTasks.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-500">
                  No tasks
                </p>
              )}
            </div>
          </div>

        </div>

        {selectedTask && (
          <TaskDetailPanel
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onStatusChange={(updatedTask) => {
              setTasks((currentTasks) =>
                currentTasks.map((task) =>
                  task.id === updatedTask.id
                    ? updatedTask
                    : task
                )
              );

              setSelectedTask(updatedTask);
            }}
          />
        )}

        {showCreateTask && (
          <CreateTaskModal
            projectId={project.id}
            members={project.members ?? []}
            onClose={() => setShowCreateTask(false)}
            onCreated={(newTask) => {
              setTasks((currentTasks) => [
                ...currentTasks,
                newTask,
              ]);
            }}
          />
        )}

      </div>
    </main>
  );
}