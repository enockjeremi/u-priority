import { tasks } from "@/app/libs/endpoints/tasks";
import { schemaEditTask } from "@/app/libs/joi/schemas";
import { notifyUpdateTasks } from "@/app/libs/react-toastify";
import instance from "@/app/server/utils/axios-instance";
import { ITask } from "@/types/workspaces";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  Button,
  Input,
  Option,
  Select,
  Spinner,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { ToastContainer } from "react-toastify";

const statusList = [
  { id: 1, status: "Completado" },
  { id: 2, status: "En desarrollo" },
  { id: 3, status: "Pendiente" },
  { id: 4, status: "Pausado" },
];

const priorityList = [
  { id: 1, priority: "A" },
  { id: 2, priority: "B" },
  { id: 3, priority: "C" },
  { id: 4, priority: "D" },
];

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

const EditTaskComponent = ({ taskToEdit }: { taskToEdit: ITask }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: taskToEdit.name,
      description: taskToEdit.description,
      statusid: taskToEdit.status.id?.toString(),
      priorityid: taskToEdit.priority.id?.toString(),
    },
    resolver: joiResolver(schemaEditTask),
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
          queryClient.invalidateQueries("tasksByStatusInWorkspaces");
          queryClient.invalidateQueries("tasks");
          notifyUpdateTasks();
        },
        onError: (error) => {
          console.log("error: ", error);
        },
      }
    );
  };

  return (
    <div className="w-full p-6 mt-4 flex flex-col gap-4">
      <ToastContainer containerId={"NotifyUpdateTasks"} />
      <Typography
        placeholder={undefined}
        variant="h3"
        color="black"
        className="font-normal leading-none"
      >
        Actualizando tarea
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-8 mt-4"
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
              className="text-white mt-2 px-2 py-2 rounded-md bg-red-500"
            >
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="w-full">
          <Textarea
            className="min-h-48 overflow-hidden resize-none"
            maxLength={255}
            {...register("description")}
            label="Descripcion de la tarea"
          />
          {errors.description && (
            <p
              role="alert"
              className="text-white mt-1 px-2 py-2 rounded-md bg-red-500"
            >
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="w-full flex flex-col gap-4 items-center">
          <Controller
            name="statusid"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                size="md"
                defaultValue={taskToEdit.status.status}
                placeholder={undefined}
                label="Estado"
              >
                {statusList.map((item) => (
                  <Option key={item.id} value={item.id.toString()}>
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
                defaultValue={taskToEdit.priority.priority}
                label="Prioridad"
                size="md"
                placeholder={undefined}
              >
                {priorityList.map((item) => (
                  <Option key={item.id} value={item.id.toString()}>
                    {item.priority}
                  </Option>
                ))}
              </Select>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full flex items-center justify-center"
          disabled={mutation.isLoading && true}
          color="green"
          size="md"
          placeholder={undefined}
        >
          {mutation.isLoading ? (
            <Spinner className="h-4 w-4 text-gray-900/10" />
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </form>
    </div>
  );
};

export default EditTaskComponent;
