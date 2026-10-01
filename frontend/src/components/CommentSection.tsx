'use client';

import { useEffect, useState } from 'react';

import {
  getComments,
  createComment,
  deleteComment,
} from '../lib/api';

import type { Comment } from '../types';

interface CommentSectionProps {
  taskId: number;
  userId: number;
}

export default function CommentSection({
  taskId,
  userId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadComments() {
      try {
        setLoading(true);
        setError('');

        const data = await getComments(taskId);

        setComments(data);
      } catch (error) {
        console.error(error);
        setError('Unable to load comments.');
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [taskId]);

  async function handleCreateComment() {
    if (!content.trim()) {
      return;
    }

    try {
      setIsCreating(true);
      setError('');

      const newComment = await createComment({
        content: content.trim(),
        taskId,
      });

      setComments((currentComments) => [
        ...currentComments,
        newComment,
      ]);

      setContent('');
    } catch (error) {
      console.error(error);
      setError('Unable to create comment.');
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteComment(commentId: number) {
    try {
      await deleteComment(commentId);

      setComments((currentComments) =>
        currentComments.filter(
          (comment) => comment.id !== commentId
        )
      );
    } catch (error) {
      console.error(error);
      setError('Unable to delete comment.');
    }
  }

  return (
    <div className="mt-8 border-t border-white/10 pt-6">

      {/* Heading */}
      <h3 className="text-sm font-semibold text-white">
        Comments
      </h3>

      {/* Loading */}
      {loading && (
        <p className="mt-4 text-sm text-slate-500">
          Loading comments...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="mt-4 text-sm text-rose-400">
          {error}
        </p>
      )}

      {/* Comments */}
      {!loading && comments.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">
          No comments yet.
        </p>
      )}

      <div className="mt-4 space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">
                  {comment.user?.email || 'Unknown user'}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  {new Date(
                    comment.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              {/* Delete only own comment */}
              {comment.userId === userId && (
                <button
                  onClick={() =>
                    handleDeleteComment(comment.id)
                  }
                  className="text-xs text-slate-500 transition hover:text-rose-400"
                >
                  Delete
                </button>
              )}
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {comment.content}
            </p>
          </div>
        ))}
      </div>

      {/* Add comment */}
      <div className="mt-6">
        <textarea
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          placeholder="Write a comment..."
          maxLength={500}
          rows={3}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50"
        />

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-slate-600">
            {content.length}/500
          </span>

          <button
            onClick={handleCreateComment}
            disabled={
              isCreating || !content.trim()
            }
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCreating
              ? 'Adding...'
              : 'Add Comment'}
          </button>
        </div>
      </div>
    </div>
  );
}