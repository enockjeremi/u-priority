"use client";
import Link from "next/link";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import Cookies from "js-cookie";

import { workspaces as workspaces_endpoints } from "@/app/libs/endpoints/workspaces";

import { CopyPlusIcon } from "@/app/client/components/icons/copy-plus-icon";
import { ListDetailsIcon } from "@/app/client/components/icons/list-details-icon";
import { NavbarCollapseIcon } from "@/app/client/components/icons/navbar-collapse-icon";
import { NavbarExpandIcon } from "@/app/client/components/icons/navbar-expand-icon";
import { StackIcon } from "@/app/client/components/icons/stack-icon";
import { PlusIcon } from "@/app/client/components/icons/plus-icon";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUserToken } from "@/app/server/token/user-token";

interface IWorkspaces {
  id?: string;
  name: string;
}

const fetchWorkspaces = async (token: any) => {
  const res = await fetch(workspaces_endpoints.getAll, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
  return res;
};

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
  const [toggle, setToggle] = useState<boolean>(false);
  const [toggleInputAddWorkspaces, setToggleInputAddWorkspaces] =
    useState<boolean>(false);

  const token = getUserToken();
  const queryClient = useQueryClient();
  const mutation = useMutation((formData: any) => {
    return fetch(workspaces_endpoints.create, formData);
  });

  const { data: workspaces_list } = useQuery<IWorkspaces[]>({
    queryKey: ["workspaces", token],
    queryFn: async () => await fetchWorkspaces(token),
  });

  const onSubmit: SubmitHandler<IWorkspaces> = (data) => {
    mutation.mutate(
      {
        method: "POST",
        body: JSON.stringify({ name: data.name }),
        headers: {
          Accept: "*",
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      },
      { onSuccess: () => queryClient.invalidateQueries("workspaces") }
    );
    reset();
  };

  return (
    <nav className="w-full text-white">
      <button
        onClick={() => setToggle(!toggle)}
        className={`${
          toggle ? "text-white" : "text-black"
        } duration-200 absolute z-20 right-3 top-3 p-1`}
      >
        {toggle ? (
          <NavbarCollapseIcon className="w-6" />
        ) : (
          <NavbarExpandIcon className="w-6" />
        )}
      </button>
      <div
        className={`${
          toggle ? "translate-y-0" : "-translate-y-full"
        } duration-300 transition-all w-full h-full absolute z-10 bg-dark`}
      >
        <ul className="w-full py-14 px-4">
          <li>
            <Link
              onClick={() => setToggle(!toggle)}
              href={"/"}
              className="flex items-center space-x-1"
            >
              <ListDetailsIcon className="w-5" />
              <span>Resumen</span>
            </Link>
          </li>
          <ul className="flex flex-col mt-3 space-y-2">
            <li className="text-md py-2 my-4 px-3 border-y border-white border-dashed space-x-3 flex items-center">
              <span>Projectos en desarrollo</span>
              <CopyPlusIcon
                onClick={() =>
                  setToggleInputAddWorkspaces(!toggleInputAddWorkspaces)
                }
                className="w-5 cursor-pointer"
              />
            </li>
            <li>
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
                  } rounded-y-md rounded-l-md w-full flex items-center  px-1 py-2 focus:outline-none`}
                />
                <button
                  className={`rounded-md rounded-l-none ${
                    errors.name ? "bg-red-500" : "bg-primary"
                  } ${
                    mutation.isLoading && "pointer-events-none"
                  } bg-primary py-2 text-white duration-100 hover:bg-extradark hover:text-white`}
                >
                  <PlusIcon className={`${mutation.isLoading && 'rotate-180'}  transition-all duration-1000`} />
                </button>
              </form>
            </li>
            {workspaces_list?.map((item) => (
              <li key={item.id}>
                <Link
                  onClick={() => setToggle(!toggle)}
                  className="p-2 flex items-center space-x-2 bg-extradark rounded-md hover:bg-primary "
                  href={`/spaces/${item.id}`}
                >
                  <StackIcon className="w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </ul>
      </div>
    </nav>
  );
};

export default SidebarComponent;
