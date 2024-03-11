import { tasks } from "@/app/libs/endpoints/tasks";
import instance from "@/app/server/utils/axios-instance";
import { ITask } from "@/types/workspaces";
import {
  Button,
  Input,
  Option,
  Select,
  Spinner,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

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

const postData = (id: number | undefined, body: FormValues) => {
  const res = instance.put(tasks.updateTasks(id), body);
  return res;
};

const EditTasksComponent = ({ taskToEdit }: { taskToEdit: ITask }) => {
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      name: taskToEdit.name,
      description: taskToEdit.description,
      statusid: taskToEdit.status.id?.toString(),
      priorityid: taskToEdit.priority.id?.toString(),
    },
  });
  const queryClient = useQueryClient()
  const mutation = useMutation((data: any) => {
    return postData(taskToEdit?.id, data);
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const { name, description, statusid, priorityid } = data;
    mutation.mutate({name, description, statusid, priorityid}, {
      onSuccess: () => {
        queryClient.invalidateQueries('tasksByStatusInWorkspaces')
        queryClient.invalidateQueries('tasks')
      }, 
      onError: (error) => {
        console.log('error: ', error)
      }
    })
  };
  return (
    <div className="w-full p-6 mt-14 flex flex-col gap-4">
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
        </div>
        <div className="w-full">
          <Textarea
            className="min-h-48 overflow-hidden resize-none"
            maxLength={255}
            {...register("description")}
            label="Descripcion de la tarea"
          />
        </div>
        <div className="w-full flex flex-col gap-4 items-center">
          <Controller
            name="statusid"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                size="md"
                value={taskToEdit.status.status}
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
                value={taskToEdit.priority.priority}
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
        <Button type="submit" className="w-full flex items-center justify-center" disabled={mutation.isLoading && true} color="green" size="md" placeholder={undefined}>
          {mutation.isLoading ? <Spinner className="h-4 w-4 text-gray-900/10" /> : "Guardar Cambios"}
        </Button>
      </form>
    </div>
  );
};

export default EditTasksComponent;
