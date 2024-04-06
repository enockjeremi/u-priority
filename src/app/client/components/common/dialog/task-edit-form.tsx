import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { joiResolver } from "@hookform/resolvers/joi";

import {
  Button,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Option,
  Select,
  Textarea,
  Typography,
} from "@material-tailwind/react";

import { notifyError, notifySuccess } from "@/app/libs/react-toastify";
import { CloseIcon } from "@/app/client/components/icons/close-icon";

import { tasks } from "@/app/libs/endpoints/tasks";
import instance from "@/app/server/utils/axios-instance";

import { schemaTask } from "@/app/libs/joi/schemas";
import { QUERY_KEY_TASKS } from "@/app/server/constants/query-keys";
import { IPriority, IStatus, ITask } from "@/types/workspaces";

type FormValues = {
  name: string | undefined;
  description: string | undefined;
  statusid: string | undefined;
  priorityid: string | undefined;
};

const putTask = (id: number | undefined, body: FormValues) => {
  const res = instance.put(tasks.updateTasks(id), body);
  return res;
};

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

const TaskEditForm = ({
  taskToEdit,
  handler,
}: {
  taskToEdit: ITask | null;
  handler: () => void;
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: taskToEdit?.name,
      description: taskToEdit?.description,
      statusid: taskToEdit?.status?.id?.toString(),
      priorityid: taskToEdit?.priority?.id?.toString(),
    },
    resolver: joiResolver(schemaTask),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation((data: any) => {
    return putTask(taskToEdit?.id, data);
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const { name, description, statusid, priorityid } = data;
    mutation.mutate(
      { name, description, statusid, priorityid },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(QUERY_KEY_TASKS.tasks);
          handler();
          notifySuccess("Tarea modificada");
        },
        onError: () => {
          notifyError("No se a podido modificar.");
        },
      },
    );
  };

  return (
    <>
      <DialogHeader
        placeholder={undefined}
        className="flex w-full items-center justify-between pb-0"
      >
        <Typography placeholder={undefined} variant="h5" color="blue-gray">
          Actualizar tarea
        </Typography>

        <IconButton
          placeholder={undefined}
          color="blue-gray"
          size="sm"
          variant="text"
          onClick={handler}
        >
          <CloseIcon />
        </IconButton>
      </DialogHeader>
      <DialogBody placeholder={undefined}>
        <form
          id="editTaskForm"
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-8"
        >
          <div className="w-full">
            <Input
              crossOrigin={undefined}
              {...register("name")}
              label="Nombre de la tarea"
            />
            {errors.name && (
              <p
                role="alert"
                className="mt-2 rounded-md bg-red-500 px-2 py-2 text-white"
              >
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <Textarea
              className="min-h-48 resize-none overflow-hidden"
              maxLength={150}
              {...register("description")}
              label="Descripcion de la tarea"
            />
            {errors.description && (
              <p
                role="alert"
                className="mt-1 rounded-md bg-red-500 px-2 py-2 text-white"
              >
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex w-full flex-col items-center gap-4">
            <Controller
              name="statusid"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="md"
                  defaultValue={taskToEdit?.status?.status}
                  placeholder={undefined}
                  label="Estado"
                >
                  {statusList.map((item) => (
                    <Option key={item.id} value={item?.id?.toString()}>
                      {item.status}
                    </Option>
                  ))}
                </Select>
              )}
            />
            <Controller
              name="priorityid"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  defaultValue={taskToEdit?.priority?.priority}
                  label="Prioridad"
                  size="md"
                  placeholder={undefined}
                >
                  {priorityList.map((item) => (
                    <Option key={item.id} value={item?.id?.toString()}>
                      {item.priority}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </div>
        </form>
      </DialogBody>

      <DialogFooter placeholder={undefined}>
        <Button
          type="submit"
          form="editTaskForm"
          className="flex w-full items-center justify-center"
          disabled={mutation.isLoading && true}
          color="green"
          size="md"
          placeholder={undefined}
          loading={mutation.isLoading}
        >
          Guardar Cambios
        </Button>
      </DialogFooter>
    </>
  );
};

export default TaskEditForm;
