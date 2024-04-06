"use client";
import { tasks } from "@/app/libs/endpoints/tasks";
import { QUERY_KEY_TASKS } from "@/app/server/constants/query-keys";
import instance from "@/app/server/utils/axios-instance";
import { Typography, Button, Dialog, Card } from "@material-tailwind/react";
import React, { useState } from "react";
import { useQuery } from "react-query";
import WorkspacesCreateForm from "./workspaces-create-form";
import TasksListComponent from "@/app/client/components/common/tasks-list-component";

const getAllTasks = async () => {
  const res = await instance.get(tasks.getAll).then((res) => res.data);
  return res;
};

const HomeComponent = () => {
  const { data, isLoading } = useQuery([QUERY_KEY_TASKS.tasks], () =>
    getAllTasks(),
  );

  const completed = data
    ?.filter((item: any) => item.status.id === 1)
    .slice(0, 4);

  const [openDialogWorkspaces, setOpenDialogWorkspaces] =
    useState<boolean>(false);

  const clickToOpenDialog = () =>
    setOpenDialogWorkspaces(!openDialogWorkspaces);
    
  return (
    <>
      <Dialog
        open={openDialogWorkspaces}
        handler={clickToOpenDialog}
        placeholder={undefined}
      >
        <WorkspacesCreateForm clickToOpenDialog={clickToOpenDialog} />
      </Dialog>
      <div className="flex w-full flex-col pt-10 lg:max-w-2xl">
        <Typography variant="h4" color="blue-gray" placeholder={undefined}>
          Bienvenid@
        </Typography>
        <hr className="my-2 border-blue-gray-100" />

        {data?.length === 0 ? (
          <>
            <Typography
              variant="paragraph"
              color="blue-gray"
              placeholder={undefined}
              className=""
            >
              Para comenzar a organizarte, es necesario que crees un proyecto.
              Puedes hacerlo haciendo click
              <Button
                color="black"
                onClick={clickToOpenDialog}
                className="mx-1 px-2 py-0.5"
                placeholder={undefined}
              >
                aqui
              </Button>
              o desde el menu de navegacion.
            </Typography>
          </>
        ) : (
          <>
            <Typography
              variant="paragraph"
              color="blue-gray"
              placeholder={undefined}
              className=""
            >
              Aqui tienes un breve resumen de tus ultimas tareas actualizadas y
              completadas. &#128513;
            </Typography>
          </>
        )}
      </div>
      <div className="flex flex-col gap-1 pt-4 ">
        <Typography
          variant="h6"
          color="blue-gray"
          placeholder={undefined}
          className="px-2 py-2"
        >
          Ultimas tareas actualizadas
        </Typography>

        <TasksListComponent isLoading={isLoading} itemList={data?.slice(0, 3)} />
        <Typography
          variant="h6"
          color="blue-gray"
          placeholder={undefined}
          className="px-2 py-2"
        >
          Ultimas tareas completadas
        </Typography>

        <TasksListComponent isLoading={isLoading} itemList={completed} />
      </div>
    </>
  );
};

export default HomeComponent;
