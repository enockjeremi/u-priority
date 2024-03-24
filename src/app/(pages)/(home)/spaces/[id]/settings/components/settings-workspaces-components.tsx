"use client";
import AlertIcon from "@/app/client/components/icons/alert-icon";
import { CloseIcon } from "@/app/client/components/icons/close-icon";
import SettingsIcon from "@/app/client/components/icons/settings-icon";
import { workspaces } from "@/app/libs/endpoints/workspaces";
import { schemaWorkspaces } from "@/app/libs/joi/schemas";
import {
  notifyUpdateWorkspacesSuccessfully,
  notifyWorkspacesDeleteSuccessfully,
  notifyWorkspacesUpdateError,
} from "@/app/libs/react-toastify";
import instance from "@/app/server/utils/axios-instance";
import { FormWorkspacesValues } from "@/types/form-values";
import { IWorkspaces } from "@/types/workspaces";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
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
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");

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
    { retry: 0 }
  );

  const onSubmit: SubmitHandler<any> = (data) => {
    const body = { name: data.name.trim() };
    mutationUpdate.mutate(body, {
      onSuccess: () => {
        notifyUpdateWorkspacesSuccessfully();
      },
      onError: () => {
        notifyWorkspacesUpdateError();
      },
    });
  };

  const handleClickDelete = () => setDialogOpen(!dialogOpen);
  const handleChange = (e: any) => setConfirmName(e.target.value);
  const handleClickConfirmDelete = () => {
    const match = confirmName === workspaces.name;
    if (match) {
      mutationDelete.mutate(workspaces.id, {
        onSuccess: () => {
          router.push('/')
          notifyWorkspacesDeleteSuccessfully()
        },
        onError: (error) => {
          console.log(error)
        },
      });
    }
  };

  return (
    <>
      <ToastContainer containerId="NotifyUpdateWorkspaces" />
      <ToastContainer containerId="NotifyWorkspacesUpdateError" />
      <div className="w-full px-2 py-6 flex flex-col gap-6">
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-6 border rounded-md p-3"
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
                className="text-white px-2 py-2 rounded-md bg-red-500"
              >
                {errors.name.message}
              </p>
            )}
          </div>
          <Button
            loading={mutationUpdate.isLoading}
            fullWidth
            type="submit"
            color="green"
            size="sm"
            placeholder={undefined}
          >
            Guardar cambios
          </Button>
        </form>

        <div className="w-full flex flex-col gap-4 border rounded-md p-3 mt-4">
          <div className="flex items-center gap-2">
            <AlertIcon className="w-4 h-4" />
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
          <Button
            onClick={handleClickDelete}
            color="red"
            size="sm"
            placeholder={undefined}
          >
            Eliminar proyecto
          </Button>
        </div>
      </div>

      <Dialog
        placeholder={undefined}
        open={dialogOpen}
        handler={handleClickDelete}
      >
        <DialogHeader
          placeholder={undefined}
          className="pb-0 flex items-center justify-between w-full"
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
            <p className="text-sm text-justify">
              Para confirmar la eliminacion escriba el nombre de el proyecto:
            </p>
            <p className="text-sm font-bold py-2">{workspaces.name}</p>
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
            className="w-full flex items-center justify-center"
            disabled={mutationDelete.isLoading && true}
            color="red"
            size="sm"
            placeholder={undefined}
            onClick={handleClickConfirmDelete}
            loading={mutationDelete.isLoading}
          >
            aceptar
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default SettingsWorkspacesComponent;
