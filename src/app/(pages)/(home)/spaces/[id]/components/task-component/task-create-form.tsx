import {
  Card,
  Input,
  Button,
  Typography,
  Textarea,
  Select,
  Option,
  IconButton,
} from "@material-tailwind/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { joiResolver } from "@hookform/resolvers/joi";
import { schemaCreateTask } from "@/app/libs/joi/schemas";

import { IPriority, IStatus } from "@/types/workspaces";
import { FormTaskValues } from "@/types/task";
import { useMutation, useQueryClient } from "react-query";
import instance from "@/app/server/utils/axios-instance";
import { tasks } from "@/app/libs/endpoints/tasks";
import { TODO } from "@/types/todo.types";
import {
  notifyCreateTaskError,
  notifyCreateTaskSuccessfully,
} from "@/app/libs/react-toastify";
import { ToastContainer } from "react-toastify";
import { CloseIcon } from "@/app/client/components/icons/close-icon";

const postTask = (body: FormTaskValues) => {
  const res = instance.post(tasks.createTask, body).then((res) => res.data);
  return res;
};

export default function TaskCreateForm({
  handleClickCancel,
  statusList,
  priorityList,
  workspacesid,
}: {
  handleClickCancel: () => void;
  statusList: IStatus[];
  priorityList: IPriority[];
  workspacesid: number;
}) {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<FormTaskValues>({ resolver: joiResolver(schemaCreateTask) });
  const queryClient = useQueryClient();
  const mutation = useMutation((data: TODO) => {
    return postTask(data);
  });

  const onSubmit: SubmitHandler<FormTaskValues> = (data) => {
    const body = { ...data, workspacesid };
    mutation.mutate(body, {
      onSuccess: () => {
        queryClient.invalidateQueries("tasksByStatusInWorkspaces");
        queryClient.invalidateQueries("tasks");
        notifyCreateTaskSuccessfully();
        handleClickCancel();
      },
      onError: () => {
        notifyCreateTaskError();
      },
    });
  };

  return (
    <>
      <ToastContainer containerId="NotifyOnCreateTaskError" />
      <Card
        placeholder={undefined}
        className="p-4"
        color="transparent"
        shadow={false}
      >
        <div className="flex justify-between items-center">
          <Typography placeholder={undefined} variant="h5" color="blue-gray">
            Agrega una nueva tarea
          </Typography>

          <IconButton
            placeholder={undefined}
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={handleClickCancel}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="pt-4 mb-2 max-w-screen-lg sm:w-96"
        >
          <div className="mb-1 flex flex-col gap-3">
            <Typography
              variant="h6"
              color="blue-gray"
              className="-mb-3"
              placeholder={undefined}
            >
              Nombre
            </Typography>
            <Input
              crossOrigin={undefined}
              size="md"
              {...register("name")}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {errors.name && (
              <p
                role="alert"
                className="text-white  px-2 py-0.5 rounded-md bg-red-500"
              >
                {errors.name.message}
              </p>
            )}
            <Typography
              placeholder={undefined}
              variant="h6"
              color="blue-gray"
              className="-mb-3"
            >
              Descripcion
            </Typography>
            <Textarea
              size="md"
              {...register("description")}
              maxLength={150}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {errors.description && (
              <p
                role="alert"
                className="text-white  px-2 py-0.5 rounded-md bg-red-500"
              >
                {errors.description.message}
              </p>
            )}
            <Controller
              name="statusid"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Estado"
                  placeholder={"¿Que prioridad tiene esta tarea?"}
                >
                  {statusList?.map((item) => (
                    <Option key={item.id} value={item?.id?.toString()}>
                      {item.status}
                    </Option>
                  ))}
                </Select>
              )}
            />
            {errors.statusid && (
              <p
                role="alert"
                className="text-white  px-2 py-0.5 rounded-md bg-red-500"
              >
                {errors.statusid.message}
              </p>
            )}

            <Controller
              control={control}
              name="priorityid"
              render={({ field }) => (
                <Select
                  {...field}
                  label="Prioridad"
                  placeholder={"¿Que prioridad tiene esta tarea?"}
                >
                  {priorityList?.map((item) => (
                    <Option key={item.id} value={item?.id?.toString()}>
                      {item.priority}
                    </Option>
                  ))}
                </Select>
              )}
            />
            {errors.priorityid && (
              <p
                role="alert"
                className="text-white  px-2 py-0.5 rounded-md bg-red-500"
              >
                {errors.priorityid.message}
              </p>
            )}
          </div>

          <Button
            placeholder={undefined}
            type="submit"
            color="green"
            className="mt-6"
            fullWidth
            loading={mutation.isLoading}
          >
            Agregar
          </Button>
        </form>
      </Card>
    </>
  );
}
