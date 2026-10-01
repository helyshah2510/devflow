'use client';

import { useCallback, useEffect, useState } from 'react';
import { getProjects, getTasks } from '@/src/lib/api';
import type { Project, Task } from '@/src/types';

export function useProjectsWithTasks() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [projectsData, tasksData] = await Promise.all([
        getProjects(),
        getTasks(),
      ]);

      setProjects(projectsData);
      setTasks(tasksData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { projects, tasks, loading, reload: loadData };
}