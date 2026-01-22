"use client";

import { useCallback } from "react";

import { UseDialogContext } from "@/src/shared/context/dialog.context";
import { cn } from "@/src/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function ChronoCustomDialog() {
  const {
    isOpen,
    title,
    renderContent,
    renderFooter,
    description,
    headerIcon,
    setIsOpen,
    closeDialog,
    dialogClassName,
    contentClassName,
  } =
    UseDialogContext();

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setIsOpen(true);
        return;
      }
      closeDialog();
    },
    [closeDialog, setIsOpen],
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={cn("w-fit sm:max-w-none", dialogClassName)}>
        <DialogHeader className={cn("gap-2", headerIcon ? "items-center text-center" : undefined)}>
          {headerIcon}
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <div className={cn(contentClassName)}>{renderContent}</div>
        {renderFooter ? <DialogFooter>{renderFooter}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}
