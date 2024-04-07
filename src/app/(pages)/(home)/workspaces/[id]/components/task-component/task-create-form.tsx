"use client";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { joiResolver } from "@hookform/resolvers/joi";

import {
  Card,
  Input,
  Button,
  Typography,
  Textarea,
  Select,
  Option,
  IconButton,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import { notifyError, notifySuccess } from "@/app/libs/react-toastify";
import { CloseIcon } from "@/app/client/components/icons/close-icon";

import instance from "@/app/server/utils/axios-instance";
import { tasks } from "@/app/libs/endpoints/tasks";

import { schemaTask } from "@/app/libs/joi/schemas";
import { IPriority, IStatus } from "@/types/workspaces";
import { QUERY_KEY_TASKS } from "@/app/server/constants/query-keys";
import { FormTaskValues } from "@/types/form-values";

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
  } = useForm<FormTaskValues>({
    defaultValues: {
      statusid: "2",
    },
    resolver: joiResolver(schemaTask),
  });
  const queryClient = useQueryClient();
  const mutation = useMutation((data: FormTaskValues) => {
    return postTask(data);
  });

  const onSubmit: SubmitHandler<FormTaskValues> = (data) => {
    const body = { ...data, workspacesid };
    mutation.mutate(body, {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY_TASKS.tasks_list);
        queryClient.invalidateQueries(QUERY_KEY_TASKS.tasks);
        notifySuccess("Tarea creada.");
        handleClickCancel();
      },
      onError: () => {
        notifyError("No se a podido crear la tarea.");
      },
    });
  };

  return (
    <>
      <DialogHeader className="py-2" placeholder={undefined}>
        <div className="flex w-full items-center justify-between">
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
      </DialogHeader>
      <DialogBody className="py-0" placeholder={undefined}>
        <form
          id="createTaskForm"
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-screen-lg "
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
                className="rounded-md  bg-red-500 px-2 py-0.5 text-white"
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
                className="rounded-md  bg-red-500 px-2 py-0.5 text-white"
              >
                {errors.description.message}
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
                className="rounded-md  bg-red-500 px-2 py-0.5 text-white"
              >
                {errors.priorityid.message}
              </p>
            )}
          </div>
        </form>
      </DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          form="createTaskForm"
          placeholder={undefined}
          type="submit"
          color="green"
          className="flex items-center justify-center"
          fullWidth
          loading={mutation.isLoading}
        >
          Agregar
        </Button>
      </DialogFooter>
    </>
  );
}
