'use client';

import { useEffect, useState } from 'react';
import { useProjectsWithTasks } from '@/src/hooks/useProjectsWithTasks';
import ProjectCard from '@/src/components/ProjectCard';
import AddProjectModal from '@/src/components/AddProjectModal';
import DeleteConfirmModal from '@/src/components/DeleteConfirmModal';
import { deleteProject, getUsers } from '@/src/lib/api';
import type { Project, User } from '@/src/types';

export default function AdminProjectsPage() {
  const { projects, tasks, loading, reload } = useProjectsWithTasks();
  const [showAddModal, setShowAddModal] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [users, setUsers] = useState<User[]>([]);
  const [filterUserId, setFilterUserId] = useState('');

  useEffect(() => {
    getUsers().then(setUsers).catch(console.error);
  }, []);

  const filteredProjects = filterUserId
    ? projects.filter((project) =>
        project.members?.some((m) => m.id === Number(filterUserId))
      )
    : projects;

  async function handleConfirmDelete() {
    if (!projectToDelete) return;

    setDeleting(true);
    setDeleteError('');

    try {
      await deleteProject(projectToDelete.id);
      await reload();
      setProjectToDelete(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Something went wrong'
      );
    } finally {
      setDeleting(false);
    }
  }

  function handleCancelDelete() {
    setProjectToDelete(null);
    setDeleteError('');
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <p className="text-slate-400">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 text-white">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-indigo-400">ADMIN PANEL</p>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-slate-400">
            {filteredProjects.length} project
            {filteredProjects.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterUserId}
            onChange={(e) => setFilterUserId(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          >
            <option value="">All members</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm hover:bg-indigo-500"
          >
            + Add Project
          </button>
        </div>
      </div>

      {filteredProjects.length === 0 && (
        <p className="text-sm text-slate-400">
          No projects found for this member.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => {
          const projectTasks = tasks.filter(
            (task) => task.projectId === project.id
          );

          return (
            <ProjectCard
              key={project.id}
              project={project}
              tasks={projectTasks}
              basePath="/admin/projects"
              onEdit={(p) => setProjectToEdit(p)}
              onDelete={(p) => setProjectToDelete(p)}
            />
          );
        })}
      </div>

      {showAddModal && (
        <AddProjectModal
          onClose={() => setShowAddModal(false)}
          onSaved={reload}
        />
      )}

      {projectToEdit && (
        <AddProjectModal
          project={projectToEdit}
          onClose={() => setProjectToEdit(null)}
          onSaved={reload}
        />
      )}

      {projectToDelete && (
        <DeleteConfirmModal
          projectName={projectToDelete.name}
          deleting={deleting}
          error={deleteError}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}