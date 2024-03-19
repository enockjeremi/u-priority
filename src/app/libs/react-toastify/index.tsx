import { ReactNode } from "react";
import { Bounce, toast } from "react-toastify";

export const notifyUpdateTasks = () =>
  toast.success("Tarea modificada!", {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    containerId: "NotifyUpdateTasks",
  });

export const notifyTaskDeletedError = () =>
  toast.error("No se a podido eliminar la tarea.", {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    containerId: "NotifyDeleteSuccessTasks",
  });

export const notifyTaskDeletedSuccessfully = () =>
  toast.success("Tarea eliminada!", {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    containerId: "NotifyDeleteSuccessTasks",
  });

export const notifyToConfirmToDeleteTask = (Node: ReactNode) => {
  toast(Node, {
    position: "bottom-right",
    autoClose: false,
    closeButton: false,
    closeOnClick: false,
    draggable: false,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    containerId: "NotifyOnConfimTasks",
    toastId: "NotifyOnConfimTasks",
  });
};
