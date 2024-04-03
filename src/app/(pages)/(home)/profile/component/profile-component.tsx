"use client";
import IsLoadingComponent from "@/app/client/components/common/is-loading-component";
import { CloseIcon } from "@/app/client/components/icons/close-icon";
import EyeOffIcon from "@/app/client/components/icons/eye-off-icon";
import EyeOnIcon from "@/app/client/components/icons/eye-on-icon";
import { auth } from "@/app/libs/endpoints/auth";
import { schemaChangePassword } from "@/app/libs/joi/schemas";
import instance from "@/app/server/utils/axios-instance";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import Joi from "joi";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "react-query";

type FormValues = {
  old_password: string;
  new_password: string;
  cnew_password: string;
};

const ProfileComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: joiResolver(schemaChangePassword) });
  const { data, isLoading } = useQuery(["user"], async () => {
    const res = await instance.get(auth.profile).then((res) => res.data);
    return res;
  });
  const [oldPassword, setOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [cnewPassword, setCnewPassword] = useState(false);

  const [dialogChange, setDialogChange] = useState(false);
  const handleDialogChange = () => setDialogChange(!dialogChange);

  const handleCnewPassword = () => setCnewPassword(!cnewPassword);
  const handleNewPassword = () => setNewPassword(!newPassword);
  const handleOldPassword = () => setOldPassword(!oldPassword);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };
  return (
    <div className="mx-auto flex h-[80vh]  w-full flex-col items-center justify-center">
      <Typography
        placeholder={undefined}
        variant="h5"
        className="py-4"
        color="blue-gray"
      >
        Informacion del usuario
      </Typography>
      <Card className="w-[420px]" placeholder={undefined}>
        <CardBody placeholder={undefined} className="p-3">
          <IsLoadingComponent isLoading={isLoading}>
            <div className="flex w-full items-center justify-between p-3">
              <Typography
                placeholder={undefined}
                className="text-sm"
                variant="h6"
                color="blue-gray"
              >
                Usuario
              </Typography>
              <Typography
                placeholder={undefined}
                variant="small"
                color="blue-gray"
                className="first-letter:uppercase"
              >
                {data?.username}
              </Typography>
            </div>
            <hr className=" border-blue-gray-50" />
            <div className="flex w-full items-center justify-between p-3">
              <Typography
                placeholder={undefined}
                className="text-sm"
                variant="h6"
                color="blue-gray"
              >
                Email
              </Typography>
              <Typography
                placeholder={undefined}
                variant="small"
                color="blue-gray"
              >
                {data?.email}
              </Typography>
            </div>
            <hr className=" border-blue-gray-50" />
            <div className="flex w-full items-center justify-between p-3">
              <Typography
                placeholder={undefined}
                className="text-sm"
                variant="h6"
                color="blue-gray"
              >
                Contraseña
              </Typography>
              <Button
                onClick={handleDialogChange}
                placeholder={undefined}
                size="sm"
                color="blue-gray"
              >
                Cambiar contraseña
              </Button>
            </div>
          </IsLoadingComponent>
        </CardBody>
      </Card>

      <Dialog
        open={dialogChange}
        handler={handleDialogChange}
        placeholder={undefined}
        size="sm"
      >
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
            // onClick={handleClickEditTask}
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
            //   disabled={mutation.isLoading && true}
            color="green"
            size="md"
            placeholder={undefined}
            //   loading={mutation.isLoading}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ProfileComponent;
