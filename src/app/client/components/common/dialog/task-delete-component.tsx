import { tasks } from "@/app/libs/endpoints/tasks";
import { notifySuccess, notifyError } from "@/app/libs/react-toastify";
import { QUERY_KEY_TASKS } from "@/app/server/constants/query-keys";
import instance from "@/app/server/utils/axios-instance";
import { Typography, Button } from "@material-tailwind/react";
import React from "react";
import { useMutation, useQueryClient } from "react-query";

const TaskDeleteComponent = ({
  taskDelete,
  handler,
}: {
  taskDelete: any;
  handler: () => void;
}) => {
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
        queryClient.invalidateQueries(QUERY_KEY_TASKS.tasks);
        handler();
        notifySuccess("Tarea eliminada.");
      },

      onError: () => {
        notifyError("No se a podido eliminar.");
      },
    });
  };
  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <Typography
        variant="h6"
        color="blue-gray"
        className="font-normal leading-none opacity-70"
        placeholder={undefined}
      >
        ¿Estas seguro de eliminar la tarea?
      </Typography>
      <div className="flex items-center justify-center gap-4">
        <Button
          color="green"
          size="sm"
          onClick={() => handler()}
          placeholder={undefined}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => handleClickDeleteTask(taskDelete?.id)}
          color="red"
          size="sm"
          placeholder={undefined}
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default TaskDeleteComponent;
