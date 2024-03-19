"use client";
import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ToastContainer, toast } from "react-toastify";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
  Spinner,
  Textarea,
  Typography,
} from "@material-tailwind/react";

import {
  notifyTaskDeletedError,
  notifyTaskDeletedSuccessfully,
  notifyToConfirmToDeleteTask,
} from "@/app/libs/react-toastify";

import TasksComponent from "./task-component";
import { IStatus, ITask, IWorkspaces } from "@/types/workspaces";

import instance from "@/app/server/utils/axios-instance";
import { workspaces as workSpacesEndpoint } from "@/app/libs/endpoints/workspaces";
import { tasks } from "@/app/libs/endpoints/tasks";

import { BackArrowIcon } from "@/app/client/components/icons/back-arrow-icon";
import PencilPlusIcon from "@/app/client/components/icons/pencil-plus-icon";
import TrashIcon from "@/app/client/components/icons/trash-icon";

const TABLE_HEAD = ["Nombre", "Estado"];

const SpacesComponent = ({
  workspaces,
  statusList,
}: {
  workspaces: IWorkspaces;
  statusList: IStatus[];
}) => {
  const queryClient = useQueryClient();
  const toastId = useRef<any>(null);

  const mutation = useMutation(
    async (id: number | undefined) => {
      return await instance
        .delete(tasks.deleteTasks(id))
        .then((res) => res.data);
    },
    { retry: 0 }
  );

  const [selectTasksByStatus, setSelectTasksByStatus] = useState<number>(0);
  const [toggleTasksInfo, setToggleTasksInfo] = useState(false);
  const [toggleEditTasks, setToggleEditTasks] = useState(false);
  const [dialogAddTask, setDialogAddTask] = useState(false);

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

  const handleClickDeleteTask = (tasksId: number | undefined) => {
    mutation.mutate(tasksId, {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasksByStatusInWorkspaces"]);
        setTasksInfo(null);
        setToggleTasksInfo(false);
        notifyTaskDeletedSuccessfully();
      },
      onError: () => {
        notifyTaskDeletedError();
      },
    });
  };

  const NotifyToConfirmTaskDeletion = ({ closeToast }: any) => {
    return (
      <div className="flex justify-center items-center gap-4">
        <Button
          placeholder={undefined}
          onClick={() => closeToast()}
          size="sm"
          color="red"
        >
          Cancelar
        </Button>
        <Button
          placeholder={undefined}
          onClick={() => {
            handleClickDeleteTask(tasksInfo?.id);
            closeToast();
          }}
          size="sm"
          color="green"
        >
          Confirmar
        </Button>
      </div>
    );
  };

  const handleClickAddTask = () => setDialogAddTask(!dialogAddTask);

  return (
    <>
      <div
        className={`${
          toggleTasksInfo ? "translate-x-0" : "-translate-x-full"
        } duration-300 transition-all w-full h-full overflow-hidden bg-white fixed z-20 top-0 right-0`}
      >
        {/* Button Back */}
        <button
          onClick={() => {
            setToggleTasksInfo(!toggleTasksInfo);
            setToggleEditTasks(false);
            setTasksInfo(undefined);
          }}
          className={`text-black duration-200 hover:scale-125 absolute z-20 right-3 top-3 p-1`}
        >
          <BackArrowIcon className="w-6" />
        </button>

        {/* Button Edit */}
        <button
          onClick={() => setToggleEditTasks(!toggleEditTasks)}
          className="absolute z-20 right-14 duration-200 hover:scale-125  text-black top-3 p-1"
        >
          <PencilPlusIcon className="w-6" />
        </button>

        {/* Button Delete */}
        <button
          onClick={() => {
            if (!toast.isActive(toastId.current)) {
              notifyToConfirmToDeleteTask(<NotifyToConfirmTaskDeletion />);
            }
          }}
          className="absolute z-20 left-3 duration-200 hover:scale-110  text-black top-3 p-1"
        >
          <TrashIcon className="w-6" />
        </button>
        {tasksInfo ? (
          <TasksComponent tasksId={tasksInfo?.id} isEdit={toggleEditTasks} />
        ) : null}
      </div>

      <div className="w-full pt-6 px-2">
        <ToastContainer containerId={"NotifyOnConfimTasks"} />
        <ToastContainer containerId={"NotifyDeleteSuccessTasks"} />
        <div className="w-full flex flex-col gap-4">
          <Typography
            className="ml-2"
            placeholder={undefined}
            variant="h5"
            color="blue-gray"
          >
            {workspaces.name}
          </Typography>
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
                                setToggleTasksInfo(!toggleTasksInfo);
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
        <DialogHeader className="" placeholder={undefined}>
          Agregar nueva tarea
        </DialogHeader>
        <form>
          <DialogBody placeholder={undefined}>
            <div className="flex flex-col gap-4">
              <Input crossOrigin={undefined} label="Nombre" />
              <Textarea label="Descripcion" />
            </div>
          </DialogBody>
          <DialogFooter placeholder={undefined}>
            <Button
              variant="text"
              color="red"
              onClick={handleClickAddTask}
              className="mr-1"
              placeholder={undefined}
            >
              <span>Cancel</span>
            </Button>
            <Button
              variant="gradient"
              color="green"
              onClick={handleClickAddTask}
              placeholder={undefined}
            >
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
};

export default SpacesComponent;
