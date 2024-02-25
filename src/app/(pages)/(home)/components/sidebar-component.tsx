"use client";
import Link from "next/link";
import React, { useState } from "react";

import { CopyPlusIcon } from "@/app/client/components/icons/copy-plus-icon";
import { ListDetailsIcon } from "@/app/client/components/icons/list-details-icon";
import { NavbarCollapseIcon } from "@/app/client/components/icons/navbar-collapse-icon";
import { NavbarExpandIcon } from "@/app/client/components/icons/navbar-expand-icon";
import { StackIcon } from "@/app/client/components/icons/stack-icon";
import { PlusIcon } from "@/app/client/components/icons/plus-icon";
import { SubmitHandler, useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";

const workSpaces = [
  { id: 1, name: "Espacio de trabajo 1" },
  { id: 2, name: "Espacio de trabajo 2" },
  { id: 3, name: "Espacio de trabajo 3" },
];

interface IWorkspaces {
  name: string;
}
const schema = Joi.object({
  name: Joi.string().min(4).required(),
});

const SidebarComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IWorkspaces>({ resolver: joiResolver(schema) });
  const [toggle, setToogle] = useState<boolean>(false);
  const [toggleInputAddWorkspaces, setToggleInputAddWorkspaces] =
    useState<boolean>(false);

  const onSubmit: SubmitHandler<IWorkspaces> = (data) => {
    console.log(data);
  };
  
  return (
    <nav className="w-full text-white">
      <button
        onClick={() => setToogle(!toggle)}
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
            <Link href={"/"} className="flex items-center space-x-1">
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
                  toggleInputAddWorkspaces ? "hidden" : "flex"
                } duration-150 transition-all`}
                onSubmit={handleSubmit(onSubmit)}
              >
                <input
                  {...register("name")}
                  className={`text-dark ${
                    errors.name ? "bg-red-300" : "bg-white"
                  } rounded-y-md rounded-l-md w-full  px-1 py-2 focus:outline-none`}
                />
                <button
                  className={`rounded-md rounded-l-none ${
                    errors.name ? "bg-red-500" : "bg-primary"
                  } bg-primary py-2 text-white duration-100 hover:bg-extradark hover:text-white`}
                >
                  <PlusIcon />
                </button>
              </form>
            </li>
            {workSpaces.map((item) => (
              <li
                className="p-2 flex items-center space-x-2 bg-extradark rounded-md "
                key={item.id}
              >
                <StackIcon className="w-5" />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </ul>
      </div>
    </nav>
  );
};

export default SidebarComponent;
