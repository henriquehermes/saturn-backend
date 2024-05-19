import { TaskPriority, TaskColumnId, TaskType, Task } from '@prisma/client';
import prisma from '../client';

/**
 * Create a new task
 * @param {string} userId - User ID
 * @param {string} projectId - Project ID
 * @param {Object} data - Task data
 * @param {TaskPriority} data.priority - Priority of the task
 * @param {TaskColumnId} data.columnId - Column ID of the task
 * @param {string} data.content - Content of the task
 * @param {TaskType} data.type - Type of the task
 * @param {string} data.title - Title of the task
 * @returns {Promise<Task>} - Created task
 */
const createTask = async (
  userId: string,
  projectId: string,
  data: {
    priority: TaskPriority;
    columnId: TaskColumnId;
    content: string;
    type: TaskType;
    title: string;
  }
): Promise<Task> => {
  const lastTask = await prisma.task.findFirst({
    where: { userId, projectId },
    orderBy: { createdAt: 'desc' }
  });

  const lastTaskId = lastTask ? parseInt(lastTask.id.split('-')[1]) : 0;
  const taskId = `TASK-${lastTaskId + 1}`;

  const task = await prisma.task.create({
    data: {
      taskId,
      priority: data.priority,
      columnId: data.columnId,
      content: data.content,
      type: data.type,
      title: data.title,
      userId,
      projectId
    }
  });

  return task;
};

/**
 * Get all tasks for a user in a project
 * @param {string} userId - User ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Task[]>} - Array of tasks
 */
const getAll = async (userId: string, projectId: string): Promise<Task[]> => {
  const tasks = await prisma.task.findMany({
    where: { userId, projectId }
  });

  return tasks;
};

/**
 * Update a task
 * @param {string} userId - User ID
 * @param {string} projectId - Project ID
 * @param {Object} data - Task data
 * @param {string} data.id - ID of the task to update
 * @param {TaskPriority} data.priority - Priority of the task
 * @param {TaskColumnId} data.columnId - Column ID of the task
 * @param {string} data.content - Content of the task
 * @param {TaskType} data.type - Type of the task
 * @param {string} data.title - Title of the task
 * @returns {Promise<Task>} - Updated task
 */
const updateTask = async (
  userId: string,
  projectId: string,
  data: {
    id: string;
    priority: TaskPriority;
    columnId: TaskColumnId;
    content: string;
    type: TaskType;
    title: string;
  }
): Promise<Task> => {
  const task = await prisma.task.update({
    where: {
      id: data.id,
      userId,
      projectId
    },
    data: {
      columnId: data.columnId,
      content: data.content,
      type: data.type,
      title: data.title,
      priority: data.priority
    }
  });

  return task;
};

/**
 * Delete a task
 * @param {string} userId - User ID
 * @param {string} projectId - Project ID
 * @param {string} taskId - ID of the task to delete
 * @returns {Promise<void>}
 */
const deleteTask = async (userId: string, projectId: string, taskId: string): Promise<void> => {
  await prisma.task.delete({
    where: {
      id: taskId,
      userId,
      projectId
    }
  });
};

export default {
  createTask,
  getAll,
  updateTask,
  deleteTask
};
