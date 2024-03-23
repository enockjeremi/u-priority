"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { ToastContainer } from "react-toastify";

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

import TaskDetailComponent from "./task-component/task-detail-component";
import { IPriority, IStatus, ITask, IWorkspaces } from "@/types/workspaces";

import instance from "@/app/server/utils/axios-instance";
import { workspaces as workSpacesEndpoint } from "@/app/libs/endpoints/workspaces";

import TaskCreateForm from "./task-component/task-create-form";
import TaskEditComponent from "./task-component/task-edit-form";
import { useRouter } from "next/navigation";

const TABLE_HEAD = ["Nombre", "Estado"];

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
  const { id: spacesID } = workspaces;

  const { data, isLoading } = useQuery<IWorkspaces>({
    queryKey: ["tasksByStatusInWorkspaces", { spacesID, selectTasksByStatus }],
    queryFn: async () => {
      return await instance
        .get(workSpacesEndpoint.filterByStatus(spacesID, selectTasksByStatus))
        .then((res) => res.data);
    },
  });

  const taskList = data;
  const taskListEmpty =
    taskList?.tasks?.length !== undefined ? taskList.tasks.length > 0 : false;

  const handleSelectStatusChange = (value: any) => {
    setSelectTasksByStatus(Number(value));
    queryClient.invalidateQueries("tasksByStatusInWorkspaces");
  };

  //Remover o mejorar
  const stringlent = (strg: string | undefined) => {
    if (!strg) return "";
    if (strg.length > 17) {
      return strg.substring(0, 17) + "...";
    }
    return strg;
  };

  const handleClickAddTask = () => setDialogAddTask(!dialogAddTask);
  const handleClickTaskDetail = () => {
    setDialogToEditTasks(false);
    setDialogTaskDetail(!dialogTaskDetail);
  };
  const handleClickEditTask = () => setDialogToEditTasks(!dialogToEditTasks);

  const handleClickSettings = () => {
    router.push(`/spaces/${workspaces.id}/settings`);
  };
  return (
    <>
      <Dialog
        placeholder={undefined}
        open={dialogTaskDetail}
        handler={handleClickTaskDetail}
      >
        {tasksInfo ? (
          dialogToEditTasks ? (
            <TaskEditComponent
              statusList={statusList}
              priorityList={priorityList}
              taskToEdit={tasksInfo}
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

      <div className="w-full pt-6 px-2">
        <ToastContainer containerId={"NotifyOnCreateTaskSuccess"} />
        <ToastContainer containerId={"NotifyDeleteSuccessTasks"} />
        <div className="w-full flex flex-col gap-4">
          <div className="flex justify-between items-center">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              </svg>
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

        <Card placeholder={undefined}>
          <CardBody className="px-0 overflow-hidden" placeholder={undefined}>
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                    >
                      <Typography
                        placeholder={undefined}
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="p-4">
                      <div className="flex justify-center w-full items-center gap-3">
                        <Spinner />
                      </div>
                    </td>
                  </tr>
                ) : taskListEmpty ? (
                  taskList?.tasks?.map((item, index) => {
                    const isLast = index === taskList?.tasks?.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";
                    return (
                      <tr key={item.id}>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setTasksInfo(item);
                                setDialogTaskDetail(!dialogTaskDetail);
                              }}
                            >
                              <Typography
                                placeholder={undefined}
                                variant="small"
                                color="blue-gray"
                                className="font-bold"
                              >
                                {stringlent(item.name)}
                              </Typography>
                            </button>
                          </div>
                        </td>

                        <td className={classes}>
                          <div className="w-max">
                            <Chip
                              size="sm"
                              variant="ghost"
                              value={item?.status?.status}
                              color={
                                item?.status?.id === 1
                                  ? "green"
                                  : item?.status?.id === 2
                                  ? "blue"
                                  : item?.status?.id === 3
                                  ? "amber"
                                  : "red"
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="pt-5 pl-4 pr-4">
                      <div className="flex items-center gap-3">
                        <Typography
                          placeholder={undefined}
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          Aun no has asignado ninguna tarea...
                        </Typography>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
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
