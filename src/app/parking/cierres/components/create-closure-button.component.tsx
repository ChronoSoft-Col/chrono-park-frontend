"use client";

import ChronoButton from "@chrono/chrono-button.component";
import { Plus } from "lucide-react";
import { UseDialogContext } from "@/src/shared/context/dialog.context";
import CreateClosureDialogContent from "./create-closure-dialog.component";

export default function CreateClosureButton() {
  const { openDialog } = UseDialogContext();

  return (
    <ChronoButton
      onClick={() => {
        openDialog({
          title: "Crear Nuevo Cierre de Caja",
          description: "",
          content: <CreateClosureDialogContent />,
        });
      }}
      icon={<Plus className="h-4 w-4" />}
    >
      Nuevo Cierre
    </ChronoButton>
  );
}
