"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";

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
import SettingsIcon from "@/app/client/components/icons/settings-icon";
import { QUERY_KEY_TASKS } from "@/app/server/constants/query-keys";

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
    queryKey: [QUERY_KEY_TASKS.tasks_list, { spacesID, selectTasksByStatus }],
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
    queryClient.invalidateQueries(QUERY_KEY_TASKS.tasks_list);
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

      <div className="w-full pt-6 px-2">
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
