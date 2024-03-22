"use client";
import {
  Button,
  Chip,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Spinner,
} from "@material-tailwind/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { tasks } from "@/app/libs/endpoints/tasks";
import instance from "@/app/server/utils/axios-instance";
import TrashIcon from "@/app/client/components/icons/trash-icon";
import { useState } from "react";
import {
  notifyTaskDeletedError,
  notifyTaskDeletedSuccessfully,
} from "@/app/libs/react-toastify";

const getTasksById = (id: number | undefined) => {
  if (!id) return null;
  const res = instance.get(tasks.getById(id)).then((res) => res.data);
  return res;
};

const TaskComponent = ({
  tasksId,
  clickToCancel,
  handleClicEditTask
}: {
  handleClicEditTask: () => void;
  clickToCancel: () => void;
  tasksId: number | undefined;
}) => {
  const [toggleComfirm, setToggleConfirm] = useState(false);
  const { data: task, isLoading } = useQuery(
    ["task", tasksId],
    () => getTasksById(tasksId),
    {
      enabled: tasksId !== undefined,
      retry: 0,
    }
  );

  const mutation = useMutation(
    async (id: number | undefined) => {
      return await instance
        .delete(tasks.deleteTasks(id))
        .then((res) => res.data);
    },
    { retry: 0 }
  );

  const queryClient = useQueryClient();

  const handleClickDeleteTask = (tasksId: number | undefined) => {
    mutation.mutate(tasksId, {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasksByStatusInWorkspaces"]);
        clickToCancel()
        notifyTaskDeletedSuccessfully();
      },
      onError: () => {
        notifyTaskDeletedError();
      },
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="w-full flex h-[50vh] items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <>
          <DialogHeader placeholder={undefined} className="pb-2">
            {task?.name}
          </DialogHeader>
          <DialogBody placeholder={undefined}>
            <div className="flex flex-col gap-8 justify-between">
              <div>{task?.description}</div>
              <div>
                <div className="flex justify-between items-center">
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
                <TrashIcon className="w-6 h-6" />
              </Button>
              <Button
                variant="gradient"
                color="green"
                onClick={() => handleClicEditTask()}
                disabled={toggleComfirm}
                placeholder={undefined}
              >
                <span>Editar</span>
              </Button>
            </div>
            {toggleComfirm ? (
              <div className="flex flex-col pt-3 space-y-1 items-center">
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
        </>
      )}
    </>
  );
};

export default TaskComponent;