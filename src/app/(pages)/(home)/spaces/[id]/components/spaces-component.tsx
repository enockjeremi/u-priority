"use client";
import React, { useEffect, useState } from "react";

const SpacesComponent = ({ workspaces }: { workspaces: any }) => {
  const [listTasksByStatus, setListTasksByStatus] = useState([]);
  const tasks = workspaces.tasks;

  const handleSelectStatusChange = (e: any) => {
    const value = e.currentTarget.value;
  };

  return (
    <div className="w-full">
      <select className="" defaultValue={1} onChange={handleSelectStatusChange}>
        <option value={1}>completado</option>
        <option value={2}>en desarrollo</option>
        <option value={3}>pendientes</option>
        <option value={4}>pausadas</option>
      </select>

      <div>
        <ul></ul>
      </div>
    </div>
  );
};

export default SpacesComponent;
