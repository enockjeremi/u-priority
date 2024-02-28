"use client";
import { workspaces } from "@/app/libs/endpoints/workspaces";
import { getUserToken } from "@/app/server/token/user-token";
import { IWorkspaces } from "@/types/workspaces";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";

const fetchWorkspacesByStatus = async (
  workspacesId: number,
  statusId: number,
  token: any
) => {
  const res = await fetch(workspaces.filterByStatus(workspacesId, statusId), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
  return res;
};

const SpacesComponent = ({ workspaces }: { workspaces: any }) => {
  const [selectTasksByStatus, setSelectTasksByStatus] = useState(1);
  const queryClient = useQueryClient();
  const token = getUserToken();
  const workspacesId = workspaces.id;

  const { data, isLoading } = useQuery<IWorkspaces>({
    queryKey: [
      "tasksByStatusInWorkspaces",
      { token, workspacesId, selectTasksByStatus },
    ],
    queryFn: async () =>
      await fetchWorkspacesByStatus(workspacesId, selectTasksByStatus, token),
  });

  const handleSelectStatusChange = (e: any) => {
    setSelectTasksByStatus(e.currentTarget.value);
    queryClient.invalidateQueries("tasksByStatusInWorkspaces");
  };

  return (
    <div className="w-full">
      <select className="" defaultValue={1} onChange={handleSelectStatusChange}>
        <option value={1}>completado</option>
        <option value={2}>en desarrollo</option>
        <option value={3}>pendientes</option>
        <option value={4}>pausadas</option>
      </select>

      <div>
        <ul>
          {isLoading
            ? "cargando..."
            : data?.tasks?.map((item) => (
                <li key={item.id}>{item.status.status}</li>
              ))}
        </ul>
      </div>
    </div>
  );
};

export default SpacesComponent;
