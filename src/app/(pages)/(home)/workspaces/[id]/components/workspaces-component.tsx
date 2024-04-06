"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";

import {
  Button,
  Dialog,
  IconButton,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";

import TaskCreateForm from "./task-component/task-create-form";
import SettingsIcon from "@/app/client/components/icons/settings-icon";

import instance from "@/app/server/utils/axios-instance";
import { tasks } from "@/app/libs/endpoints/tasks";
import { QUERY_KEY_TASKS } from "@/app/server/constants/query-keys";
import { IPriority, IStatus, ITask, IWorkspaces } from "@/types/workspaces";
import TasksListComponent from "@/app/client/components/common/tasks-list-component";

const priorityList = [
  { id: 1, priority: "A" },
  { id: 2, priority: "B" },
  { id: 3, priority: "C" },
  { id: 4, priority: "D" },
];

const statusList = [
  { id: 1, status: "Completado" },
  { id: 2, status: "En desarrollo" },
  { id: 3, status: "Pendiente" },
  { id: 4, status: "En pausa" },
];

const SpacesComponent = ({ workspaces }: { workspaces: IWorkspaces }) => {
  const router = useRouter();

  const [status, setStatus] = useState<number>(0);
  const [dialogAddTask, setDialogAddTask] = useState(false);

  const allStatusList = [{ id: 0, status: "Todas las tareas" }, ...statusList];
  const { id: workspacesId } = workspaces;

  const { data, isLoading } = useQuery<ITask[]>({
    queryKey: [QUERY_KEY_TASKS.tasks, { workspacesId }],
    queryFn: async () => {
      return await instance
        .get(tasks.getTaskByWorkspaces(workspacesId))
        .then((res) => res.data);
    },
  });

  const tasksList =
    status !== 0 ? data?.filter((items) => items.status.id === status) : data;

  const handleSelectStatusChange = (value: any) => {
    setStatus(Number(value));
  };

  const handleClickAddTask = () => setDialogAddTask(!dialogAddTask);

  const handleClickSettings = () => {
    router.push(`/workspaces/${workspaces.id}/settings`);
  };

  return (
    <>
      <div className="w-full px-2 pt-6">
        <div className="flex w-full flex-col gap-4 pb-2">
          <div className="flex items-center justify-between">
            <Typography
              className="md:text-2xl lg:ml-4"
              placeholder={undefined}
              variant="h6"
              color="blue-gray"
            >
              {workspaces.name}
            </Typography>
            <IconButton
              placeholder={undefined}
              color="blue-gray"
              size="sm"
              variant="text"
              className="w-[20%]"
              onClick={handleClickSettings}
            >
              <SettingsIcon />
            </IconButton>
          </div>
          <div className="flex w-full flex-col items-center justify-between space-y-3 lg:flex-row lg:gap-4 lg:space-y-0">
            <Select
              onChange={handleSelectStatusChange}
              label="Selecciona por estado"
              placeholder={"Selecciona un estado"}
            >
              {allStatusList?.map((item) => (
                <Option key={item.id} value={item?.id?.toString()}>
                  {item.status}
                </Option>
              ))}
            </Select>
            <Button
              onClick={handleClickAddTask}
              size="md"
              className="w-full"
              placeholder={undefined}
              color="green"
            >
              Agregar tarea
            </Button>
          </div>
        </div>

        <TasksListComponent<ITask>
          // openDetail={handleClickTaskDetail}
          isLoading={isLoading}
          itemList={tasksList}
        />
      </div>

      <Dialog
        placeholder={undefined}
        open={dialogAddTask}
        handler={handleClickAddTask}
        size="md"
      >
        <TaskCreateForm
          statusList={statusList}
          priorityList={priorityList}
          workspacesid={workspaces.id}
          handleClickCancel={handleClickAddTask}
        />
      </Dialog>
    </>
  );
};

export default SpacesComponent;
