"use client"
import { Typography } from "@material-tailwind/react";
import React from "react";

const SettingsWorkspacesComponent = () => {
  return (
    <div className="w-full px-2">
      <Typography
        variant="h6"
        color="blue-gray"
        className="-mb-3"
        placeholder={undefined}
      >
        Ajustes del proyecto
      </Typography>
    </div>
  );
};

export default SettingsWorkspacesComponent;
