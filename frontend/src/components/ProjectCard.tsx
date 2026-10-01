'use client';

import Link from 'next/link';
import type { Project,Task } from '../types';

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  basePath?:string;
  onDelete?: (project: Project) => void;
  onEdit?: (project: Project) => void;
}

export default function ProjectCard({
  project,
  tasks,
  basePath = '/projects',
  onDelete,
  onEdit,
}: ProjectCardProps) {
  const done = tasks.filter(
    (task) => task.status === 'DONE'
  ).length;

  const total = tasks.length;

  const progress =
    total > 0
      ? Math.round((done / total) * 100)
      : 0;

  const todo = tasks.filter(
    (task) => task.status === 'TODO'
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === 'IN_PROGRESS'
  ).length;

  return (
    <Link
      href={`${basePath}/${project.id}`}
      className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-indigo-500/10"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-md">
          {project.name[0]?.toUpperCase()}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Project #{project.id}
          </span>

          {onEdit && (
            <button
              type="button"
              title="Edit project"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(project);
              }}
              className="rounded-md px-2 py-1 text-xs text-slate-500 transition-colors hover:bg-indigo-500/10 hover:text-indigo-300"
            >
              Edit
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              title="Delete project"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(project);
              }}
              className="rounded-md px-2 py-1 text-xs text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Name */}
      <h2 className="mb-1 text-base font-semibold text-white transition-colors group-hover:text-indigo-300">
        {project.name}
      </h2>

      {/* Description */}
      <p className="mb-5 min-h-10 text-sm text-slate-400">
        {project.description || 'No description provided.'}
      </p>

      {/* Progress */}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Progress
          </span>

          <span className="text-slate-400">
            {done}/{total} tasks
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status counts */}
      <div className="mt-5 flex gap-2 border-t border-white/5 pt-4">
        <span className="rounded-full bg-slate-500/20 px-2 py-0.5 text-xs text-slate-400">
          {todo} To Do
        </span>

        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
          {inProgress} In Progress
        </span>

        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
          {done} Done
        </span>
      </div>
    </Link>
  );
}