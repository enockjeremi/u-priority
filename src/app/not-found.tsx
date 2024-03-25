"use client";
import Link from "next/link";
import { Typography } from "@material-tailwind/react";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex items-center justify-center p-6">
      <div className="flex flex-col items-center justify-center text-center gap-2">
        <Typography color="blue-gray" variant="h1" placeholder={undefined}>
          404
        </Typography>
        <Typography color="blue-gray" placeholder={undefined}>
          No hemos podido encontrar la pagina que has solicitado.
        </Typography>
        <Typography placeholder={undefined}>
          Vuelve al <Link className="text-blue-500" href="/">inicio</Link>
        </Typography>
      </div>
    </div>
  );
}
