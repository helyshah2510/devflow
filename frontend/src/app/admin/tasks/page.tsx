'use client';

import { useEffect, useState } from 'react';
import { getTasks,deleteTask } from '@/src/lib/api';
import type { Task} from '@/src/types';
import DeleteTaskModal from '@/src/components/DeleteTaskModal';

export default function AdminTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

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

    if (loading) {
        return <p>Loading tasks...</p>;
    }

    return (
        <div className="px-6 py-10 text-white">
            <div className="mb-8">
                <p className="text-sm text-indigo-400">ADMIN PANEL</p>

                <h1 className="text-2xl font-semibold">
                    Tasks
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                </p>
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
                        {tasks.map((task) => (
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