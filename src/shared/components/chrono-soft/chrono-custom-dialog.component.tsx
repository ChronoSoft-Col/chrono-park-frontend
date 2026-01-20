"use client";

import { useCallback } from "react";

import { UseDialogContext } from "../../context/dialog.context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function ChronoCustomDialog() {
  const { isOpen, title, renderContent, renderFooter, description, setIsOpen, closeDialog, dialogClassName, contentClassName } =
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
      <DialogContent className={"w-fit sm:max-w-none " + (dialogClassName ?? "") }>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {description ? <DialogDescription>{description}</DialogDescription> : null}
        <div className={contentClassName ?? ""}>{renderContent}</div>
        {renderFooter ? <DialogFooter>{renderFooter}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}
