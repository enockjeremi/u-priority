"use client";
import IsLoadingComponent from "@/app/client/components/common/is-loading-component";
import { useSignOut } from "@/app/client/hooks/useSignOut";
import { tasks } from "@/app/libs/endpoints/tasks";
import { QUERY_KEY_TASKS } from "@/app/server/constants/query-keys";
import instance from "@/app/server/utils/axios-instance";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  CardFooter,
  Button,
  Chip,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { useQuery } from "react-query";
import DialogTaskComponent from "../../../client/components/common/dialog/dialog-tasks-component";
import { IPriority, IStatus, ITask } from "@/types/workspaces";

const getAllTasks = async () => {
  const res = await instance.get(tasks.getAll).then((res) => res.data);
  return res;
};

const HomeComponent = ({
  statusList,
  priorityList,
}: {
  statusList: IStatus[];
  priorityList: IPriority[];
}) => {
  const [dialogToEditTasks, setDialogToEditTasks] = useState(false);
  const [dialogTaskDetail, setDialogTaskDetail] = useState(false);

  const [tasksInfo, setTasksInfo] = useState<ITask | null>();

  const { data, isLoading } = useQuery([QUERY_KEY_TASKS.tasks], () =>
    getAllTasks(),
  );

  const completed = data?.filter
    ?.filter((item: any) => item.status.id === 1)
    .slice(0, 4);

  const handleClickTaskDetail = (task?: any) => {
    if (task) setTasksInfo(task);
    setDialogToEditTasks(false);
    setDialogTaskDetail(!dialogTaskDetail);
  };

  const handleClickEditTask = () => setDialogToEditTasks(!dialogToEditTasks);

  return (
    <>
      <DialogTaskComponent
        openDialog={dialogTaskDetail}
        statusList={statusList}
        priorityList={priorityList}
        taskDetail={tasksInfo}
        taskEdit={dialogToEditTasks}
        handleOpenEdit={handleClickEditTask}
        handleOpenDetail={handleClickTaskDetail}
      />

      <div className="flex flex-col">
        <Typography variant="h4" color="blue-gray" placeholder={undefined}>
          Resumen de tareas
        </Typography>
        <hr className="my-2 border-blue-gray-100" />

        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <Card className="mt-6 w-full " placeholder={undefined}>
            <CardBody className="flex w-full flex-col" placeholder={undefined}>
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-2"
                placeholder={undefined}
              >
                Agregadas recientemente
              </Typography>
              <div className="flex w-full flex-col gap-2">
                <IsLoadingComponent isLoading={isLoading}>
                  {data?.create?.map((task: any) => (
                    <Button
                      key={task.id}
                      placeholder={undefined}
                      variant="outlined"
                      color="black"
                      type="button"
                      onClick={() => {
                        handleClickTaskDetail(task);
                      }}
                      size="sm"
                      className="flex w-full items-center justify-between px-4"
                    >
                      <p>{task?.name}</p>
                      <Chip
                        size="sm"
                        variant="ghost"
                        value={task?.status?.status}
                        color={
                          task?.status?.id === 1
                            ? "green"
                            : task?.status?.id === 2
                              ? "blue"
                              : task?.status?.id === 3
                                ? "amber"
                                : "red"
                        }
                      />
                    </Button>
                  ))}
                </IsLoadingComponent>
              </div>
            </CardBody>
          </Card>
          <Card className="mt-6 w-full" placeholder={undefined}>
            <CardBody placeholder={undefined}>
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-2"
                placeholder={undefined}
              >
                Actualizadas recientemente
              </Typography>
              <div className="flex w-full flex-col gap-2">
                <IsLoadingComponent isLoading={isLoading}>
                  {data?.update?.map((task: any) => (
                    <Button
                      key={task.id}
                      placeholder={undefined}
                      variant="outlined"
                      color="black"
                      type="button"
                      onClick={() => {
                        handleClickTaskDetail(task);
                      }}
                      size="sm"
                      className="flex w-full items-center justify-between px-4"
                    >
                      <p>{task?.name}</p>
                      <Chip
                        size="sm"
                        variant="ghost"
                        value={task?.status?.status}
                        color={
                          task?.status?.id === 1
                            ? "green"
                            : task?.status?.id === 2
                              ? "blue"
                              : task?.status?.id === 3
                                ? "amber"
                                : "red"
                        }
                      />
                    </Button>
                  ))}
                </IsLoadingComponent>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="w-full">
          <Card className="mt-6 " placeholder={undefined}>
            <CardBody placeholder={undefined}>
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-2"
                placeholder={undefined}
              >
                Tareas completadas
              </Typography>
              <div className="flex w-full flex-col gap-2">
                <IsLoadingComponent isLoading={isLoading}>
                  {completed?.map((task: any) => (
                    <Button
                      key={task.id}
                      placeholder={undefined}
                      variant="outlined"
                      color="black"
                      type="button"
                      onClick={() => {
                        handleClickTaskDetail(task);
                      }}
                      size="sm"
                      className="flex w-full items-center justify-between px-4"
                    >
                      <p>{task?.name}</p>
                      <Chip
                        size="sm"
                        variant="ghost"
                        value={task?.status?.status}
                        color={
                          task?.status?.id === 1
                            ? "green"
                            : task?.status?.id === 2
                              ? "blue"
                              : task?.status?.id === 3
                                ? "amber"
                                : "red"
                        }
                      />
                    </Button>
                  ))}
                </IsLoadingComponent>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};

export default HomeComponent;
