"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  Button,
  Card,
  CardBody,
  Dialog,
  Typography,
} from "@material-tailwind/react";

import PasswordUpdateForm from "./password-update-form";
import IsLoadingComponent from "@/app/client/components/common/is-loading-component";

import { auth } from "@/app/libs/endpoints/auth";
import instance from "@/app/server/utils/axios-instance";

const ProfileComponent = () => {
  const { data, isLoading } = useQuery(["user"], async () => {
    const res = await instance.get(auth.profile).then((res) => res.data);
    return res;
  });

  const [dialogChange, setDialogChange] = useState(false);
  const handleDialogChange = () => setDialogChange(!dialogChange);

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
                {data?.username || ""}
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
                {data?.email || ""}
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
        <PasswordUpdateForm
          userId={data?.id}
          handleDialogChange={handleDialogChange}
        />
      </Dialog>
    </div>
  );
};

export default ProfileComponent;
