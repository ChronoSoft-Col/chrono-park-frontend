"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateClosureDialog from "./create-closure-dialog.component";

export default function CreateClosureButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Nuevo Cierre
      </Button>

      <CreateClosureDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
