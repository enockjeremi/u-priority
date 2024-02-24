"use client";
import Link from "next/link";
import React, { useState } from "react";

import { CopyPlusIcon } from "@/app/client/components/icons/copy-plus-icon";
import { ListDetailsIcon } from "@/app/client/components/icons/list-details-icon";
import { NavbarCollapseIcon } from "@/app/client/components/icons/navbar-collapse-icon";
import { NavbarExpandIcon } from "@/app/client/components/icons/navbar-expand-icon";
import { StackIcon } from "@/app/client/components/icons/stack-icon";

const workSpaces = [
  { id: 1, name: "Espacio de trabajo 1" },
  { id: 2, name: "Espacio de trabajo 2" },
  { id: 3, name: "Espacio de trabajo 3" },
];

const SidebarComponent = () => {
  const [toggle, setToogle] = useState<boolean>(false);
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
                onClick={() => console.log("add workSpaces")}
                className="w-5 cursor-pointer"
              />
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
