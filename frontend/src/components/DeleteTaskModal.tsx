'use client';

type Props = {
  taskTitle: string;
  deleting: boolean;
  error: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteTaskModal({
  taskTitle,
  deleting,
  error,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-6 text-white">

        <h2 className="mb-2 text-lg font-semibold">
          Delete task?
        </h2>

        <p className="mb-4 text-sm text-slate-400">
          You are about to delete{' '}
          <span className="font-semibold text-white">
            {taskTitle}
          </span>
          . This cannot be undone.
        </p>

        {error && (
          <p className="mb-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2">

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-md px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-md bg-red-600 px-4 py-2 text-sm hover:bg-red-500 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>

        </div>
      </div>
    </div>
  );
}