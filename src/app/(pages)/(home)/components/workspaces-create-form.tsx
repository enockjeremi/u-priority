import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { Button, DialogBody, Input } from "@material-tailwind/react";
import { notifyError, notifySuccess } from "@/app/libs/react-toastify";

import { workspaces } from "@/app/libs/endpoints/workspaces";
import instance from "@/app/server/utils/axios-instance";

import { schemaWorkspaces } from "@/app/libs/joi/schemas";
import { QUERY_KEY_TASKS } from "@/app/server/constants/query-keys";
import { FormWorkspacesValues } from "@/types/form-values";

const WorkspacesCreateForm = ({
  clickToOpenDialog,
}: {
  clickToOpenDialog: () => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormWorkspacesValues>({
    resolver: joiResolver(schemaWorkspaces),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation((formData: any) => {
    return instance.post(workspaces.create, formData);
  });

  const onSubmit: SubmitHandler<FormWorkspacesValues> = (data) => {
    mutation.mutate(
      { name: data.name },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(QUERY_KEY_TASKS.workspaces);
          clickToOpenDialog();
          notifySuccess("Nuevo proyecto agregado.");
        },
        onError: () => {
          notifyError("Hubo un problema al agregar el proyecto.");
        },
      },
    );
    reset();
  };

  return (
    <>
      <DialogBody placeholder={undefined}>
        <form
          className="flex w-full flex-col gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            crossOrigin={undefined}
            {...register("name")}
            label="Nombre del nuevo proyecto"
          />
          {errors.name && (
            <p
              role="alert"
              className="rounded-md bg-red-500 px-2 py-1 text-sm text-white"
            >
              {errors.name.message}
            </p>
          )}
          <Button
            type="submit"
            className="flex w-full items-center justify-center"
            disabled={mutation.isLoading && true}
            color="green"
            size="sm"
            placeholder={undefined}
            loading={mutation.isLoading}
          >
            Agregar
          </Button>
        </form>
      </DialogBody>
    </>
  );
};

export default WorkspacesCreateForm;
