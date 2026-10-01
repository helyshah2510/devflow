'use client';

import { useEffect, useState } from 'react';
import { createProject, updateProject, getUsers } from '@/src/lib/api';
import type { Project, User } from '@/src/types';

type Props = {
  project?: Project; // passed = edit mode, missing = add mode
  onClose: () => void;
  onSaved: () => void;
};

export default function AddProjectModal({ project, onClose, onSaved }: Props) {
  const isEdit = !!project;

  const [name, setName] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // newly picked people
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // People already on the project (edit mode only). These cannot be removed.
  const currentMembers = project?.members ?? [];
  const currentIds = currentMembers.map((m) => m.id);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => setError(err.message));
  }, []);

  // Newly picked people (shown as removable tags)
  const selectedUsers = users.filter((u) => selectedIds.includes(u.id));

  // People still available in the dropdown
  const availableUsers = users.filter(
    (u) => !currentIds.includes(u.id) && !selectedIds.includes(u.id)
  );

  function addMember(id: number) {
    setSelectedIds((current) => [...current, id]);
  }

  function removeMember(id: number) {
    setSelectedIds((current) => current.filter((x) => x !== id));
  }

  async function handleSubmit() {
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (isEdit && project) {
        await updateProject(project.id, {
          name: name.trim(),
          description: description.trim(),
          memberIds: selectedIds.length > 0 ? selectedIds : undefined,
        });
      } else {
        await createProject({
          name: name.trim(),
          description: description.trim() || undefined,
          memberIds: selectedIds,
        });
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 text-white">
        <h2 className="mb-4 text-lg font-semibold">
          {isEdit ? 'Edit Project' : 'Add Project'}
        </h2>

        <label className="mb-1 block text-sm text-slate-400">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-3 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
        />

        <label className="mb-1 block text-sm text-slate-400">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mb-3 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
        />

        {isEdit && (
          <>
            <p className="mb-1 text-sm text-slate-400">Current members</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {currentMembers.length === 0 && (
                <span className="text-xs text-slate-500">No members yet</span>
              )}
              {currentMembers.map((m) => (
                <span
                  key={m.id}
                  className="rounded-full bg-slate-700/50 px-3 py-1 text-xs text-slate-300"
                >
                  {m.email}
                </span>
              ))}
            </div>
          </>
        )}

        <label className="mb-1 block text-sm text-slate-400">
          {isEdit ? 'Add members' : 'Members'}
        </label>
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) addMember(Number(e.target.value));
          }}
          disabled={availableUsers.length === 0}
          className="mb-2 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
        >
          <option value="">
            {availableUsers.length === 0
              ? 'No more members to add'
              : 'Select a member...'}
          </option>
          {availableUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>

        {selectedUsers.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <span
                key={user.id}
                className="flex items-center gap-2 rounded-full bg-indigo-600/20 px-3 py-1 text-xs text-indigo-300"
              >
                {user.email}
                <button
                  type="button"
                  onClick={() => removeMember(user.id)}
                  className="text-indigo-300 hover:text-white"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm hover:bg-indigo-500 disabled:opacity-50"
          >
            {saving
              ? isEdit
                ? 'Saving...'
                : 'Creating...'
              : isEdit
                ? 'Save'
                : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}