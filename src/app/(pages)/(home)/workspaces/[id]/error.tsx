"use client";

import { Button, Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
export default function Error() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 h-screen w-full items-center justify-center p-6">
      <Typography
        variant="small"
        className="max-w-sm text-center"
        color="blue-gray"
        placeholder={undefined}
      >
        Lo sentimos, no hemos podido cargar o encontrar la informacion que has
        solicitado.
      </Typography>
      <Button placeholder={undefined} size="sm" onClick={() => router.back()}>
        Regresar
      </Button>
    </div>
  );
}
