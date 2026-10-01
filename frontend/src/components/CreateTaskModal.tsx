'use client';

import { useEffect,useState } from 'react';
import type { Task,TaskPriority,User } from '../types';
import { createTask,getUsers } from '../lib/api';
import { useAuth } from '../context/AuthContext';


interface CreateTaskModalProps {
  projectId: number;
  onClose: () => void;
  onCreated: (task: Task) => void;
}

export default function CreateTaskModal({
  projectId,
  onClose,
  onCreated,
}: CreateTaskModalProps) {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [assignedToId, setAssignedToId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

    useEffect(() => {
        if (user?.role !== 'ADMIN') return;
        getUsers().then(setUsers).catch(console.error);
    }, [user?.role]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      setIsCreating(true);
      setError('');

      const newTask = await createTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        projectId,
        assignedToId: assignedToId ?? undefined,
      });

      onCreated(newTask);
      onClose();
    } catch (error) {
      console.error(error);
      setError('Unable to create task.');
    } finally {
      setIsCreating(false);
    }

  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#12141f] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              New Task
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Create Task
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <label className="block">
            <span className="text-sm text-slate-400">
              Title
            </span>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter task title"
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50"
            />
          </label>

          {/* Description */}
          <label className="mt-5 block">
            <span className="text-sm text-slate-400">
              Description
            </span>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe the task"
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50"
            />
          </label>

          {/* Assign to */}
            <label className="mt-5 block">
            <span className="text-sm text-slate-400">Assign to</span>

            {user?.role === 'ADMIN' ? (
                <select
                value={assignedToId ?? ''}
                onChange={(event) =>
                    setAssignedToId(
                    event.target.value ? Number(event.target.value) : null
                    )
                }
                className="mt-2 w-full rounded-lg border border-white/10 bg-[#12141f] px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50"
                >
                <option value="">Unassigned</option>
                {users.map((u) => (
                    <option key={u.id} value={u.id}>
                    {u.email}
                    </option>
                ))}
                </select>
            ) : (
                <p className="mt-2 text-sm text-slate-300">{user?.email} (you)</p>
            )}
            </label>

          {/* Priority */}
          <div className="mt-5">
            <span className="text-sm text-slate-400">
              Priority
            </span>

            <div className="mt-2 flex gap-2">
              {(['LOW', 'MEDIUM', 'HIGH'] as TaskPriority[]).map(
                (value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPriority(value)}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      priority === value
                        ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30'
                        : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                    }`}
                  >
                    {value}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-rose-400">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCreating}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}