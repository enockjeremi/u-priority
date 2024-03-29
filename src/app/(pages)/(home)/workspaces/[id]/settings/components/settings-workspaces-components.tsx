"use client";
import AlertIcon from "@/app/client/components/icons/alert-icon";
import { CloseIcon } from "@/app/client/components/icons/close-icon";
import SettingsIcon from "@/app/client/components/icons/settings-icon";
import { workspaces } from "@/app/libs/endpoints/workspaces";
import { schemaWorkspaces } from "@/app/libs/joi/schemas";

import { notifyError, notifySuccess } from "@/app/libs/react-toastify";
import { QUERY_KEY_TASKS } from "@/app/server/constants/query-keys";

import instance from "@/app/server/utils/axios-instance";
import { FormWorkspacesValues } from "@/types/form-values";
import { IWorkspaces } from "@/types/workspaces";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { ToastContainer } from "react-toastify";

const putWorkspaces = (id: number, body: FormWorkspacesValues) => {
  const res = instance.put(workspaces.update(id), body);
  return res;
};

const deleteWorkspaces = (id: number) => {
  const res = instance.delete(workspaces.delete(id));
  return res;
};

const SettingsWorkspacesComponent = ({
  workspaces,
}: {
  workspaces: IWorkspaces;
}) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isMatch, setIsMatch] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormWorkspacesValues>({
    defaultValues: {
      name: workspaces.name,
    },
    resolver: joiResolver(schemaWorkspaces),
  });

  const mutationUpdate = useMutation((data: any) => {
    return putWorkspaces(workspaces?.id, data);
  });

  const mutationDelete = useMutation(
    (id: number) => {
      return deleteWorkspaces(id);
    },
    { retry: 0 },
  );

  const onSubmit: SubmitHandler<any> = (data) => {
    const body = { name: data.name.trim() };
    mutationUpdate.mutate(body, {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY_TASKS.workspaces]);
        notifySuccess("Proyecto modificado.");
      },
      onError: () => {
        notifyError("No se a podido modificar.");
      },
    });
  };

  const handleClickDelete = () => {
    setDialogOpen(!dialogOpen);
    setIsMatch(false);
  };

  const handleChange = (e: any) => {
    const value = e.target.value;
    const match = value === workspaces.name;
    if (match) setIsMatch(true);
    else if (!match) setIsMatch(false);
  };

  const handleClickConfirmDelete = () => {
    mutationDelete.mutateAsync(workspaces.id, {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY_TASKS.workspaces]);
        notifySuccess("Proyecto eliminado.");
        router.replace("/");
      },
      onError: () => {
        notifyError("No se a podido eliminar.");
      },
    });
  };

  return (
    <>
      <div className="flex w-full flex-col gap-6 px-2 py-6">
        <div className="flex items-center">
          <IconButton
            placeholder={undefined}
            color="blue-gray"
            size="sm"
            variant="text"
            className="w-[20%]"
          >
            <SettingsIcon />
          </IconButton>
          <Typography
            variant="h5"
            color="blue-gray"
            className=""
            placeholder={undefined}
          >
            Ajustes del proyecto
          </Typography>
        </div>

        <Card className="mt-6 w-full" placeholder={undefined}>
          <CardBody placeholder={undefined}>
            <form
              id="modifWorkspaces"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-4">
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="-mb-3"
                  placeholder={undefined}
                >
                  Nombre de el proyecto:
                </Typography>
                <Input
                  crossOrigin={undefined}
                  size="md"
                  {...register("name")}
                  defaultValue={workspaces.name}
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
                {errors.name && (
                  <p
                    role="alert"
                    className="rounded-md bg-red-500 px-2 py-2 text-white"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>
            </form>
          </CardBody>
          <CardFooter className="pt-0" placeholder={undefined}>
            <Button
              loading={mutationUpdate.isLoading}
              fullWidth
              type="submit"
              form="modifWorkspaces"
              color="green"
              size="sm"
              className="flex w-full items-center justify-center"
              placeholder={undefined}
            >
              Guardar cambios
            </Button>
          </CardFooter>
        </Card>

        <Card className="mt-6 w-full" placeholder={undefined}>
          <CardBody placeholder={undefined}>
            <div className="flex items-center gap-2 py-1">
              <AlertIcon className="h-4 w-4" />
              <Typography
                variant="h6"
                color="blue-gray"
                placeholder={undefined}
                className="text-sm"
              >
                Zona de riesgo
              </Typography>
            </div>
            <Typography
              placeholder={undefined}
              className=" text-justify"
              variant="small"
            >
              Si deseas eliminar este proyecto, ten en cuenta que las tareas
              adjuntas se eliminarán de forma permanente.
            </Typography>
          </CardBody>
          <CardFooter className="pt-0" placeholder={undefined}>
            <Button
              onClick={handleClickDelete}
              color="red"
              size="sm"
              placeholder={undefined}
              fullWidth
            >
              Eliminar proyecto
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog
        placeholder={undefined}
        open={dialogOpen}
        handler={handleClickDelete}
      >
        <ToastContainer containerId="NotifyWorkspacesDeleteError" />

        <DialogHeader
          placeholder={undefined}
          className="flex w-full items-center justify-between pb-0"
        >
          <Typography placeholder={undefined} variant="h6" color="blue-gray">
            Confirmar
          </Typography>
          <IconButton
            placeholder={undefined}
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={handleClickDelete}
          >
            <CloseIcon />
          </IconButton>
        </DialogHeader>
        <DialogBody className="pt-0" placeholder={undefined}>
          <div className="text-justify">
            <p className="text-justify text-sm">
              Para confirmar la eliminacion escriba el nombre de el proyecto:
            </p>
            <p className="py-2 text-sm font-bold">{workspaces.name}</p>
          </div>
          <Input
            crossOrigin={undefined}
            size="md"
            onChange={handleChange}
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        </DialogBody>
        <DialogFooter placeholder={undefined}>
          <Button
            type="submit"
            className="flex w-full items-center justify-center"
            disabled={!isMatch}
            color="red"
            size="sm"
            placeholder={undefined}
            onClick={handleClickConfirmDelete}
            loading={mutationDelete.isLoading}
          >
            eliminar
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default SettingsWorkspacesComponent;
