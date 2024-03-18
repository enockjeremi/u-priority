"use client";
import Link from "next/link";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";

import { workspaces as workspaces_endpoints } from "@/app/libs/endpoints/workspaces";

import { CopyPlusIcon } from "@/app/client/components/icons/copy-plus-icon";
import { StackIcon } from "@/app/client/components/icons/stack-icon";
import { PlusIcon } from "@/app/client/components/icons/plus-icon";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUserToken } from "@/app/server/token/user-token";
import {
  Collapse,
  IconButton,
  Navbar,
  Typography,
} from "@material-tailwind/react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import instance from "@/app/server/utils/axios-instance";

interface IWorkspaces {
  id?: string;
  name: string;
}

const schema = Joi.object({
  name: Joi.string().min(4).required(),
});

const SidebarComponent = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IWorkspaces>({ resolver: joiResolver(schema) });

  const [openNav, setOpenNav] = React.useState(false);
  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const [toggleInputAddWorkspaces, setToggleInputAddWorkspaces] =
    useState<boolean>(false);

  const token = getUserToken();
  const queryClient = useQueryClient();
  const mutation = useMutation((formData: any) => {
    return instance.post(workspaces_endpoints.create, formData);
  });

  const { data: workspaces_list } = useQuery<IWorkspaces[]>({
    queryKey: ["workspaces", token],
    queryFn: async () =>
      await instance.get(workspaces_endpoints.getAll).then((res) => res.data),
  });

  const onSubmit: SubmitHandler<IWorkspaces> = (data) => {
    mutation.mutate(
      { name: data.name },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("workspaces");
          notifyAddWorkspacesSuccessfully();
        },
        onError: () => {
          notifyAddWorkspacesError();
        },
      }
    );
    reset();
  };

  const notifyAddWorkspacesSuccessfully = () =>
    toast.success("Nuevo proyecto agregado!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      containerId: "NotifyAddWorkspacesSuccessfully",
    });

  const notifyAddWorkspacesError = () =>
    toast.error("No se pudo agragar el proyecto!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      containerId: "NotifyAddWorkspacesError",
    });

    const clickToOenNav = () => setOpenNav(!openNav)

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
        placeholder={undefined}
      >
        <Link onClick={clickToOenNav} href={"/"}>Inicio</Link>
      </Typography>
      <Typography
        placeholder={undefined}
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <span>Proyectos en desarrollo</span>
        <CopyPlusIcon
          onClick={() => setToggleInputAddWorkspaces(!toggleInputAddWorkspaces)}
          className="w-5 cursor-pointer"
        />
      </Typography>
      <Typography placeholder={undefined} as="li">
        <form
          className={`pb-4 ${
            toggleInputAddWorkspaces ? "flex" : "hidden"
          } duration-150 transition-all`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            {...register("name")}
            className={`text-dark ${
              errors.name ? "bg-red-300" : "bg-white"
            } border border- rounded-y-md rounded-l-md w-full flex items-center  px-1 py-2 focus:outline-none`}
          />
          <button
            className={`rounded-md rounded-l-none ${
              errors.name ? "bgblack-red-500" : "bg-primary"
            } ${
              mutation.isLoading && "pointer-events-none"
            } bg-primary py-2 text-white duration-100 hover:bg-extradark hover:text-white`}
          >
            <PlusIcon
              className={`${
                mutation.isLoading && "rotate-180"
              }  transition-all duration-1000`}
            />
          </button>
        </form>
      </Typography>

      {workspaces_list?.map((item) => (
        <Typography
          as="li"
          key={item.id}
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium"
          placeholder={undefined}
        >
          <StackIcon className="w-5" />
          <Link onClick={clickToOenNav} href={`/spaces/${item.id}`}>{item.name}</Link>
        </Typography>
      ))}
    </ul>
  );

  return (
    <>
      <ToastContainer containerId={"NotifyAddWorkspacesSuccessfully"} />
      <ToastContainer containerId={"NotifyAddWorkspacesError"} />
      <Navbar
        className="mx-auto max-w-screen-xl px-6 py-3"
        placeholder={undefined}
      >
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography
            as="a"
            href="#"
            variant="h6"
            className="mr-4 cursor-pointer py-1.5"
            placeholder={undefined}
          >
            Material Tailwind
          </Typography>
          <div className="hidden lg:block">{navList}</div>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
            placeholder={undefined}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </IconButton>
        </div>
        <Collapse open={openNav}>{navList}</Collapse>
      </Navbar>
    </>
  );
};

export default SidebarComponent;
