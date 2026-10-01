import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onClick:()=>void;
}

export default function TaskCard({ task,onClick, }: TaskCardProps) {
  return (
    <div onClick={onClick}
      className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-indigo-500/30 hover:bg-white/[0.05]"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-medium text-white">
          {task.title}
        </h3>

        <span className="text-xs text-slate-600">
          #{task.id}
        </span>
      </div>

      <p className="text-sm text-slate-400">
        {task.description || 'No description'}
      </p>

      <div className="mt-4">
        {task.priority === 'HIGH' && (
          <span className="rounded-full bg-rose-500/15 px-2 py-1 text-xs text-rose-400">
            High
          </span>
        )}

        {task.priority === 'MEDIUM' && (
          <span className="rounded-full bg-amber-500/15 px-2 py-1 text-xs text-amber-400">
            Medium
          </span>
        )}

        {task.priority === 'LOW' && (
          <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs text-emerald-400">
            Low
          </span>
        )}
      </div>
    </div>
  );
}