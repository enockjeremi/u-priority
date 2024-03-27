"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import {
  Button,
  Chip,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Spinner,
  Typography,
} from "@material-tailwind/react";

import { notifySuccess, notifyError } from "@/app/libs/react-toastify";
import { CloseIcon } from "@/app/client/components/icons/close-icon";
import TrashIcon from "@/app/client/components/icons/trash-icon";

import instance from "@/app/server/utils/axios-instance";
import { tasks } from "@/app/libs/endpoints/tasks";

import { QUERY_KEY_TASKS } from "@/app/server/constants/query-keys";
import IsLoadingComponent from "@/app/client/components/common/is-loading-component";

const getTasksById = (id: number | undefined) => {
  if (!id) return null;
  const res = instance.get(tasks.getById(id)).then((res) => res.data);
  return res;
};

const TaskDetailComponent = ({
  tasksId,
  clickToCancel,
  handleClickEditTask,
}: {
  handleClickEditTask: () => void;
  clickToCancel: () => void;
  tasksId: number | undefined;
}) => {
  const [toggleComfirm, setToggleConfirm] = useState(false);
  const { data: task, isLoading } = useQuery(
    ["task", tasksId],
    () => getTasksById(tasksId),
    { retry: 0 },
  );

  const mutation = useMutation(
    async (id: number | undefined) => {
      return await instance
        .delete(tasks.deleteTasks(id))
        .then((res) => res.data);
    },
    { retry: 0 },
  );

  const queryClient = useQueryClient();

  const handleClickDeleteTask = (tasksId: number | undefined) => {
    mutation.mutate(tasksId, {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY_TASKS.tasks_list);
        clickToCancel();
        notifySuccess("Tarea eliminada.");
      },
      onError: () => {
        notifyError("No se a podido eliminar.");
      },
    });
  };

  return (
    <IsLoadingComponent isLoading={isLoading}>
      <DialogHeader
        placeholder={undefined}
        className="flex items-center justify-between"
      >
        <Typography
          placeholder={undefined}
          className="w-full"
          variant="h5"
          color="blue-gray"
        >
          {task?.name || ""}
        </Typography>
        <IconButton
          placeholder={undefined}
          color="blue-gray"
          size="sm"
          variant="text"
          className="w-[20%]"
          onClick={clickToCancel}
        >
          <CloseIcon />
        </IconButton>
      </DialogHeader>
      <DialogBody placeholder={undefined}>
        <div className="flex flex-col justify-between gap-8">
          <Typography placeholder={undefined} color="gray" variant="paragraph">
            {task?.description || ""}
          </Typography>
          <div>
            <div className="flex items-center justify-between">
              <Chip size="md" value={task?.status.status || ""} />
              <Chip
                size="md"
                value={task?.priority.priority || ""}
                color={
                  task?.priority.id === 1
                    ? "green"
                    : task?.priority.id === 2
                      ? "blue"
                      : task?.priority.id === 3
                        ? "amber"
                        : "red"
                }
              />
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter
        placeholder={undefined}
        className="flex flex-col justify-between"
      >
        <div className="flex w-full justify-between">
          <Button
            variant="text"
            color="red"
            onClick={() => setToggleConfirm(!toggleComfirm)}
            className="mr-1"
            size="sm"
            placeholder={undefined}
          >
            <TrashIcon className="h-6 w-6" />
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => handleClickEditTask()}
            disabled={toggleComfirm}
            placeholder={undefined}
          >
            <span>Editar</span>
          </Button>
        </div>
        {toggleComfirm ? (
          <div className="flex flex-col items-center space-y-1 pt-3">
            <span>¿Esta seguro de eliminar esta tarea?</span>
            <div className="flex items-center gap-3">
              <Button
                color="green"
                size="sm"
                onClick={() => setToggleConfirm(!toggleComfirm)}
                placeholder={undefined}
              >
                cancelar
              </Button>
              <Button
                color="red"
                size="sm"
                onClick={() => handleClickDeleteTask(tasksId)}
                placeholder={undefined}
                loading={mutation.isLoading}
              >
                confirmar
              </Button>
            </div>
          </div>
        ) : null}
      </DialogFooter>
    </IsLoadingComponent>
  );
};

export default TaskDetailComponent;
