'use client';

import { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '@/src/lib/api';
import type { Task } from '@/src/types';
import DeleteTaskModal from '@/src/components/DeleteTaskModal';
import StatusFilter from '@/src/components/StatusFilter';

export default function AdminTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const [statusFilter, setStatusFilter] = useState('ALL');
    const [userFilter, setUserFilter] = useState('');

    useEffect(() => {
        async function loadTasks() {
            try {
                const data = await getTasks();
                setTasks(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadTasks();
    }, []);

    async function handleConfirmDelete() {
        if (!taskToDelete) return;

        setDeleting(true);
        setDeleteError('');

        try {
            await deleteTask(taskToDelete.id);

            const data = await getTasks();
            setTasks(data);

            setTaskToDelete(null);
        } catch (error) {
            setDeleteError(
                error instanceof Error
                    ? error.message
                    : 'Something went wrong'
            );
        } finally {
            setDeleting(false);
        }
    }

    // People who have at least one task (no duplicates) -> for the name dropdown
    const assignees = Array.from(
        new Map(
            tasks.flatMap((task) =>
                task.assignedTo
                    ? [[task.assignedTo.id, task.assignedTo.email] as [number, string]]
                    : []
            )
        ).entries()
    );

    // A task must pass BOTH filters to stay on the table
    const filteredTasks = tasks.filter((task) => {
        const matchesStatus =
            statusFilter === 'ALL' || task.status === statusFilter;

        const matchesUser =
            userFilter === '' || task.assignedToId === Number(userFilter);

        return matchesStatus && matchesUser;
    });

    if (loading) {
        return <p>Loading tasks...</p>;
    }

    return (
        <div className="px-6 py-10 text-white">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <p className="text-sm text-indigo-400">ADMIN PANEL</p>

                    <h1 className="text-2xl font-semibold">
                        Tasks
                    </h1>

                    <p className="mt-1 text-sm text-slate-400">
                        {filteredTasks.length} task
                        {filteredTasks.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                        className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
                    >
                        <option value="">All members</option>
                        {assignees.map(([id, email]) => (
                            <option key={id} value={id}>
                                {email}
                            </option>
                        ))}
                    </select>

                    <StatusFilter onChange={setStatusFilter} />
                </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-white/10 bg-white/[0.03]">
                        <tr>
                            <th className="px-6 py-4 text-slate-400">
                                ID
                            </th>

                            <th className="px-6 py-4 text-slate-400">
                                Task
                            </th>

                            <th className="px-6 py-4 text-slate-400">
                                Project
                            </th>

                            <th className="px-6 py-4 text-slate-400">
                                Assigned To
                            </th>

                            <th className="px-6 py-4 text-slate-400">
                                Status
                            </th>

                            <th className="px-6 py-4 text-slate-400">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredTasks.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-8 text-center text-slate-400"
                                >
                                    No tasks match these filters.
                                </td>
                            </tr>
                        )}

                        {filteredTasks.map((task) => (
                            <tr
                                key={task.id}
                                className="border-b border-white/5"
                            >
                                <td className="px-6 py-4 text-slate-400">
                                    {task.id}
                                </td>

                                <td className="px-6 py-4 font-medium text-white">
                                    {task.title}
                                </td>

                                <td className="px-6 py-4 text-slate-300">
                                    {task.project?.name || 'Unknown project'}
                                </td>

                                <td className="px-6 py-4 text-slate-300">
                                    {task.assignedTo?.email || 'Unassigned'}
                                </td>

                                <td className="px-6 py-4">
                                    {task.status}
                                </td>

                                <td className="px-6 py-4">
                                    <button
                                        type="button"
                                        onClick={() => setTaskToDelete(task)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {taskToDelete && (
                <DeleteTaskModal
                    taskTitle={taskToDelete.title}
                    deleting={deleting}
                    error={deleteError}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => {
                        setTaskToDelete(null);
                        setDeleteError('');
                    }}
                />
            )}
        </div>
    );
}