import { API_URL } from "../../enviroments";

export const workspaces = {
  getAll: `${API_URL}/workspaces/`,

  getAllTasks: (workspaces: number | undefined) =>
    `${API_URL}/workspaces/${workspaces}`,

  getBy: (id: number) => `${API_URL}/workspaces/${id}`,
  create: `${API_URL}/workspaces/`,
  update:(id: number) => `${API_URL}/workspaces/${id}`,
  delete:(id: number) => `${API_URL}/workspaces/${id}`,

  filterByStatus: (workspacesId: number, statusId: number) =>
    `${API_URL}/workspaces/${workspacesId}/status/${statusId}`,
};
