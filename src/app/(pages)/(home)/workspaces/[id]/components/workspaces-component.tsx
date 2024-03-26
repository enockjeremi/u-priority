"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Dialog,
  IconButton,
  Option,
  Select,
  Spinner,
  Typography,
} from "@material-tailwind/react";

import TaskCreateForm from "./task-component/task-create-form";
import TaskEditComponent from "./task-component/task-edit-form";
import TaskDetailComponent from "./task-component/task-detail-component";
import SettingsIcon from "@/app/client/components/icons/settings-icon";

import instance from "@/app/server/utils/axios-instance";
import { workspaces as workSpacesEndpoint } from "@/app/libs/endpoints/workspaces";

import { QUERY_KEY_TASKS } from "@/app/server/constants/query-keys";
import { IPriority, IStatus, ITask, IWorkspaces } from "@/types/workspaces";
import TasksListComponent from "./task-component/task-list-component";

const SpacesComponent = ({
  workspaces,
  statusList,
  priorityList,
}: {
  workspaces: IWorkspaces;
  statusList: IStatus[];
  priorityList: IPriority[];
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [selectTasksByStatus, setSelectTasksByStatus] = useState<number>(0);
  const [dialogToEditTasks, setDialogToEditTasks] = useState(false);
  const [dialogAddTask, setDialogAddTask] = useState(false);
  const [dialogTaskDetail, setDialogTaskDetail] = useState(false);

  const [tasksInfo, setTasksInfo] = useState<ITask | null>();

  const allStatusList = [{ id: 0, status: "Todas las tareas" }, ...statusList];
  const { id: workspacesId } = workspaces;

  const { data: tasks, isLoading } = useQuery<IWorkspaces>({
    queryKey: [
      QUERY_KEY_TASKS.tasks_list,
      { workspacesId, selectTasksByStatus },
    ],
    queryFn: async () => {
      return await instance
        .get(
          workSpacesEndpoint.filterByStatus(workspacesId, selectTasksByStatus),
        )
        .then((res) => res.data);
    },
  });

  const handleSelectStatusChange = (value: any) => {
    setSelectTasksByStatus(Number(value));
    queryClient.invalidateQueries(QUERY_KEY_TASKS.tasks_list);
  };

  const handleClickTaskDetail = (task?: any) => {
    if (task) setTasksInfo(task);
    setDialogToEditTasks(false);
    setDialogTaskDetail(!dialogTaskDetail);
  };

  const handleClickEditTask = () => setDialogToEditTasks(!dialogToEditTasks);
  const handleClickAddTask = () => setDialogAddTask(!dialogAddTask);

  const handleClickSettings = () => {
    router.push(`/workspaces/${workspaces.id}/settings`);
  };

  return (
    <>
      <Dialog
        placeholder={undefined}
        open={dialogTaskDetail}
        handler={handleClickTaskDetail}
        className="z-10"
      >
        {tasksInfo ? (
          dialogToEditTasks ? (
            <TaskEditComponent
              statusList={statusList}
              priorityList={priorityList}
              taskToEdit={tasksInfo}
              handleClickTaskDetail={handleClickTaskDetail}
              handleClickEditTask={handleClickEditTask}
            />
          ) : (
            <TaskDetailComponent
              clickToCancel={handleClickTaskDetail}
              handleClickEditTask={handleClickEditTask}
              tasksId={tasksInfo?.id}
            />
          )
        ) : (
          ""
        )}
      </Dialog>

      <div className="w-full px-2 pt-6">
        <div className="flex w-full flex-col gap-4 pb-2">
          <div className="flex items-center justify-between">
            <Typography
              // className="ml-2"
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
          <div className="pt-2">
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
          </div>
          <Button
            onClick={handleClickAddTask}
            size="sm"
            placeholder={undefined}
            color="green"
          >
            Agregar tarea
          </Button>
        </div>

        <TasksListComponent
          openDetail={handleClickTaskDetail}
          isLoading={isLoading}
          tasks={tasks?.tasks}
        />
      </div>

      <Dialog
        placeholder={undefined}
        open={dialogAddTask}
        handler={handleClickAddTask}
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
