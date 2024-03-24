import { CloseIcon } from "@/app/client/components/icons/close-icon";
import { tasks } from "@/app/libs/endpoints/tasks";
import { schemaTask } from "@/app/libs/joi/schemas";
import { notifyUpdateTasks } from "@/app/libs/react-toastify";
import instance from "@/app/server/utils/axios-instance";
import { IPriority, IStatus, ITask } from "@/types/workspaces";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  Button,
  DialogBody,
  DialogHeader,
  IconButton,
  Input,
  Option,
  Select,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { ToastContainer } from "react-toastify";

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

const TaskEditForm = ({
  taskToEdit,
  statusList,
  priorityList,
  handleClickEditTask,
}: {
  taskToEdit: ITask;
  statusList: IStatus[];
  priorityList: IPriority[];
  handleClickEditTask: () => void;
}) => {
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
    <>
      <ToastContainer containerId={"NotifyUpdateTasks"} />
      <DialogHeader
        placeholder={undefined}
        className="pb-0 flex items-center justify-between w-full"
      >
        <Typography placeholder={undefined} variant="h5" color="blue-gray">
          Actualizar tarea
        </Typography>

        <IconButton
          placeholder={undefined}
          color="blue-gray"
          size="sm"
          variant="text"
          onClick={handleClickEditTask}
        >
          <CloseIcon />
        </IconButton>
      </DialogHeader>
      <DialogBody placeholder={undefined}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-8"
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
              maxLength={150}
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
                  defaultValue={taskToEdit.priority.priority}
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
          <Button
            type="submit"
            className="w-full flex items-center justify-center"
            disabled={mutation.isLoading && true}
            color="green"
            size="md"
            placeholder={undefined}
            loading={mutation.isLoading}
          >
            Guardar Cambios
          </Button>
        </form>
      </DialogBody>
    </>
  );
};

export default TaskEditForm;
