'use client';

import { useState } from 'react';
import type { Task } from '../types';
import { updateTaskStatus } from '../lib/api';
import CommentSection from './CommentSection';
import { useAuth } from '../context/AuthContext';

interface TaskDetailPanelProps {
    task: Task;
    onClose: () => void;
    onStatusChange: (updatedTask: Task) => void;
}

export default function TaskDetailPanel({
    task,
    onClose,
    onStatusChange,
}: TaskDetailPanelProps) {
    const { user } = useAuth();
    const [status, setStatus] = useState(task.status);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');

    async function handleStatusChange(
        newStatus: Task['status']
    ) {
        if (newStatus === status) {
            return;
        }

        try {
            setIsUpdating(true);
            setError('');

            const updatedTask = await updateTaskStatus(
                task.id,
                newStatus
            );

            setStatus(updatedTask.status);

            onStatusChange(updatedTask);
        } catch (error) {
            console.error(error);
            setError('Unable to update task status.');
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-white/10 bg-[#12141f] shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 shrink-0">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Task #{task.id}
                        </p>

                        <h2 className="mt-1 text-xl font-semibold text-white">
                            Task Details
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* ✅ Scroll area starts */}
                <div className="overflow-y-auto">

                    {/* Content */}
                    <div className="px-6 py-6">

                        {/* Title */}
                        <h3 className="text-2xl font-semibold text-white">
                            {task.title}
                        </h3>

                        {/* Description */}
                        <div className="mt-6">
                            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                                Description
                            </p>

                            <p className="text-sm leading-6 text-slate-300">
                                {task.description || 'No description provided.'}
                            </p>
                        </div>

                        {/* Info */}
                        <div className="mt-6 grid grid-cols-2 gap-4">

                            {/* Priority */}
                            <div>
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Priority
                                </p>

                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${task.priority === 'HIGH'
                                        ? 'bg-rose-500/15 text-rose-400'
                                        : task.priority === 'MEDIUM'
                                            ? 'bg-amber-500/15 text-amber-400'
                                            : 'bg-emerald-500/15 text-emerald-400'
                                        }`}
                                >
                                    {task.priority}
                                </span>
                            </div>

                            {/* Project */}
                            <div>
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Project
                                </p>

                                <p className="text-sm text-slate-300">
                                    #{task.projectId}
                                </p>
                            </div>

                        </div>

                        {/* Status */}
                        <div className="mt-6">
                            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                                Status
                            </p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleStatusChange('TODO')}
                                    className={`rounded-lg px-3 py-2 text-sm transition ${status === 'TODO'
                                        ? 'bg-slate-500/20 text-slate-300 ring-1 ring-slate-500/30'
                                        : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                                        }`}
                                >
                                    To Do
                                </button>

                                <button
                                    onClick={() => handleStatusChange('IN_PROGRESS')}
                                    className={`rounded-lg px-3 py-2 text-sm transition ${status === 'IN_PROGRESS'
                                        ? 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30'
                                        : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                                        }`}
                                >
                                    In Progress
                                </button>

                                <button
                                    onClick={() => handleStatusChange('DONE')}
                                    disabled={isUpdating}
                                    className={`rounded-lg px-3 py-2 text-sm transition ${status === 'DONE'
                                        ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                                        : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                                        }`}
                                >
                                    Done
                                </button>
                            </div>
                            {error && (
                                <p className="mt-3 text-sm text-rose-400">
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* Created date */}
                        <div className="mt-6 border-t border-white/5 pt-5">
                            <p className="text-xs text-slate-500">
                                Created
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                                {new Date(task.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                    </div>
                    {user && (
                        <div className="border-t border-white/10 px-6 py-6">
                            <CommentSection
                                taskId={task.id}
                                userId={user.id}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}