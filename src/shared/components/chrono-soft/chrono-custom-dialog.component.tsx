"use client";

import { useCallback } from "react";

import { UseDialogContext } from "@/src/shared/context/dialog.context";
import { cn } from "@/src/lib/utils";
import { useIsMobile } from "@/src/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";

const DEFAULT_DIALOG_CLASS_NAME = "w-full sm:max-w-lg";

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
  } = UseDialogContext();

  const isMobile = useIsMobile();

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

  const resolvedDialogClassName = dialogClassName ?? DEFAULT_DIALOG_CLASS_NAME;

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerContent>
          <DrawerHeader
            className={cn(
              "gap-2",
              headerIcon ? "items-center text-center" : undefined
            )}
          >
            {headerIcon}
            <DrawerTitle>{title}</DrawerTitle>
            {description ? (
              <DrawerDescription>{description}</DrawerDescription>
            ) : null}
          </DrawerHeader>
          <div className={cn("px-4 overflow-y-auto", contentClassName)}>
            {renderContent}
          </div>
          {renderFooter ? (
            <DrawerFooter>{renderFooter}</DrawerFooter>
          ) : null}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={cn("w-fit sm:max-w-none", resolvedDialogClassName)}>
        <DialogHeader
          className={cn(
            "gap-2",
            headerIcon ? "items-center text-center" : undefined
          )}
        >
          {headerIcon}
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <div className={cn(contentClassName)}>{renderContent}</div>
        {renderFooter ? <DialogFooter>{renderFooter}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}
