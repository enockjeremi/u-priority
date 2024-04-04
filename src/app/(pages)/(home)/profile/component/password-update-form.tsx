"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "react-query";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  DialogHeader,
  Typography,
  IconButton,
  DialogBody,
  Input,
  DialogFooter,
  Button,
} from "@material-tailwind/react";

import { CloseIcon } from "@/app/client/components/icons/close-icon";
import EyeOffIcon from "@/app/client/components/icons/eye-off-icon";
import EyeOnIcon from "@/app/client/components/icons/eye-on-icon";

import instance from "@/app/server/utils/axios-instance";
import { auth } from "@/app/libs/endpoints/auth";
import { TODO } from "@/types/todo.types";

import { schemaChangePassword } from "@/app/libs/joi/schemas";
import { notifySuccess, notifyError } from "@/app/libs/react-toastify";

type FormValues = {
  old_password: string;
  new_password: string;
  cnew_password: string;
};

const verifyPassword = (data: TODO) => {
  const res = instance.post(auth.verifyPassword, data).then((res) => res.data);
  return res;
};

const changePassword = (id: number, data: TODO) => {
  const res = instance
    .put(auth.changePassword(id), data)
    .then((res) => res.data);
  return res;
};

const PasswordUpdateForm = ({
  userId,
  handleDialogChange,
}: {
  userId: number;
  handleDialogChange: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: joiResolver(schemaChangePassword) });

  const verify = useMutation((data: TODO) => {
    return verifyPassword(data);
  });

  const mutation = useMutation((data: TODO) => {
    return changePassword(userId, data);
  });

  const [errorVerify, setErrorVerify] = useState("");

  const [oldPassword, setOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [cnewPassword, setCnewPassword] = useState(false);

  const handleCnewPassword = () => setCnewPassword(!cnewPassword);
  const handleNewPassword = () => setNewPassword(!newPassword);
  const handleOldPassword = () => setOldPassword(!oldPassword);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const password = data.new_password.toString();
    verify.mutate(
      { password: data.old_password },
      {
        onSuccess: (data) => {
          if (data) {
            mutation.mutate(
              { password },
              {
                onSuccess: (data) => {
                  notifySuccess("La contraseña a sido cambiada con exito.");
                  handleDialogChange();
                  reset();
                },
                onError: (error) => {
                  notifyError("No se a podido cambiar la contraseña.");
                },
              },
            );
          } else {
            setErrorVerify("La contraseña actual no es correcta.");
          }
        },
      },
    );
  };
  return (
    <div>
      <DialogHeader
        placeholder={undefined}
        className="flex w-full items-center justify-between pb-0"
      >
        <Typography placeholder={undefined} variant="h5" color="blue-gray">
          Cambiar contraseña
        </Typography>

        <IconButton
          placeholder={undefined}
          color="blue-gray"
          size="sm"
          variant="text"
          onClick={handleDialogChange}
        >
          <CloseIcon />
        </IconButton>
      </DialogHeader>
      <DialogBody placeholder={undefined}>
        <form
          id="changePassword"
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-8"
        >
          <div className="flex w-full flex-col gap-5">
            <Input
              {...register("old_password")}
              crossOrigin={undefined}
              onChange={() => setErrorVerify("")}
              type={oldPassword ? "text" : "password"}
              label="Contraseña actual"
              icon={
                oldPassword ? (
                  <EyeOnIcon onClick={handleOldPassword} />
                ) : (
                  <EyeOffIcon onClick={handleOldPassword} />
                )
              }
            />
            {errors.old_password && (
              <p
                role="alert"
                className="mt-2 rounded-md bg-red-500 px-2 py-2 text-white"
              >
                {errors.old_password.message}
              </p>
            )}

            {errorVerify ? (
              <p
                role="alert"
                className="mt-2 rounded-md bg-red-500 px-2 py-2 text-white"
              >
                {errorVerify}
              </p>
            ) : null}

            <hr className="border-blue-gray-50" />

            <Input
              {...register("new_password")}
              crossOrigin={undefined}
              type={newPassword ? "text" : "password"}
              label="Nueva contraseña"
              icon={
                newPassword ? (
                  <EyeOnIcon onClick={handleNewPassword} />
                ) : (
                  <EyeOffIcon onClick={handleNewPassword} />
                )
              }
            />
            {errors.new_password && (
              <p
                role="alert"
                className="mt-2 rounded-md bg-red-500 px-2 py-2 text-white"
              >
                {errors.new_password.message}
              </p>
            )}
            <Input
              {...register("cnew_password")}
              crossOrigin={undefined}
              type={cnewPassword ? "text" : "password"}
              icon={
                cnewPassword ? (
                  <EyeOnIcon onClick={handleCnewPassword} />
                ) : (
                  <EyeOffIcon onClick={handleCnewPassword} />
                )
              }
              label="Confirmar nueva contraseña"
            />
            {errors.cnew_password && (
              <p
                role="alert"
                className="mt-2 rounded-md bg-red-500 px-2 py-2 text-white"
              >
                {errors.cnew_password.message}
              </p>
            )}
          </div>
        </form>
      </DialogBody>

      <DialogFooter placeholder={undefined}>
        <Button
          type="submit"
          form="changePassword"
          className="flex w-full items-center justify-center"
          disabled={mutation.isLoading && true}
          color="green"
          size="md"
          placeholder={undefined}
          loading={mutation.isLoading}
        >
          Confirmar
        </Button>
      </DialogFooter>
    </div>
  );
};

export default PasswordUpdateForm;
