import { TaskPriority, TaskColumnId, TaskType, Task } from '@prisma/client';
import prisma from '../client';

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
    orderBy: { createdAt: 'desc' }
  });

  let taskId = 'TASK-1'; // default taskId

  if (lastTask) {
    const lastTaskId = lastTask.id.split('-')[1];
    const newTaskIdNum = parseInt(lastTaskId) + 1;
    taskId = `TASK-${newTaskIdNum}`;
  }

  const task = await prisma.task.create({
    data: {
      id: taskId,
      priority: data.priority,
      columnId: data.columnId,
      content: data.content,
      type: data.type,
      title: data.title,
      userId,
      projectId
    }
  });

  return task as Task;
};

const getAll = async (userId: string, projectId: string): Promise<Task[]> => {
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      projectId
    }
  });

  return tasks as Task[];
};

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
    data: {
      columnId: data.columnId,
      content: data.content,
      type: data.type,
      title: data.title,
      priority: data.priority
    },
    where: {
      id: data.id,
      userId,
      projectId
    }
  });

  return task as Task;
};

const deleteTask = async (userId: string, projectId: string, taskId: string): Promise<void> => {
  await prisma.task.delete({
    where: {
      id: taskId,
      userId,
      projectId
    }
  });

  return;
};

export default {
  createTask,
  getAll,
  updateTask,
  deleteTask
};
