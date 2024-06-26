import { API_URL } from "../../enviroments";

export const tasks = {
  getAll: `${API_URL}/tasks/`,
  getAllIDs: `${API_URL}/tasks/all-ids`,
  getStatusAndPriorityList: `${API_URL}/tasks/status-priority`,
  createTask: `${API_URL}/tasks/`,
  updateTasks: (id: number | undefined) => `${API_URL}/tasks/${id}`,

  getTaskByWorkspaces: (workspacesId: number | undefined) =>
    `${API_URL}/tasks/workspaces/${workspacesId}`,
  getById: (id: any) => `${API_URL}/tasks/${id}`,

  changeStatus: (
    taskId: number | string,
    statusId: number | string | undefined,
  ) => `${API_URL}/tasks/${taskId}/status/${statusId}`,

  changePriority: (
    taskId: number | string,
    priorityId: number | string | undefined,
  ) => `${API_URL}/tasks/${taskId}/priority/${priorityId}`,

  deleteTasks: (taskId: number | undefined) => `${API_URL}/tasks/${taskId}/`,
};
