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
  const totalTasks = await prisma.task.count({
    where: { userId, projectId },
    orderBy: { createdAt: 'desc' }
  });

  const taskId = totalTasks + 1;

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
 * @param {Object} query - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 0)
 * @returns {Promise<Task[]>} - Array of tasks
 */
const getAll = async <Key extends keyof Task>(
  filter: object,
  options: {
    pageSize?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = [
    'id',
    'content',
    'columnId',
    'createdAt',
    'priority',
    'projectId',
    'taskId',
    'title',
    'type',
    'updatedAt',
    'userId'
  ] as Key[]
): Promise<{
  tasks: Pick<Task, Key>[];
  pageSize: number;
  totalPages: number;
  page: number;
  totalRows: number;
}> => {
  const totalCount = await prisma.task.count({ where: filter });
  const page = options.page ?? 0;
  const pageSize = options.pageSize ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'asc';
  const totalPages = Math.ceil(totalCount / pageSize);

  const tasks = await prisma.task.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: +page * +pageSize,
    take: +pageSize,
    orderBy: sortBy ? { [sortBy]: sortType } : { taskId: 'asc' }
  });

  return {
    tasks: tasks as Pick<Task, Key>[],
    pageSize: +pageSize,
    totalPages,
    page: +page,
    totalRows: totalCount
  };
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
