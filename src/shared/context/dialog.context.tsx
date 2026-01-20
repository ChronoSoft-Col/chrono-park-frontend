"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import ChronoYesNoFormComponent from "@chrono/chrono-yes-no-form.component";


type DialogProviderProps = {
  children: ReactNode;
};

type YesNoDialogOptions = {
  handleYes: () => void | Promise<void>;
  handleNo: () => void | Promise<void>;
  title: string;
  description: string;
    requiresReloadOnYes?: boolean;
};

type OpenDialogOptions = {
  title: string;
  description: string;
  content: ReactNode;
  footer?: ReactNode;
  dialogClassName?: string;
  contentClassName?: string;
}

type TDialogContext = {
  isOpen: boolean;
  title: string;
  description: string;
  renderContent: ReactNode;
  renderFooter: ReactNode;
  dialogClassName?: string;
  contentClassName?: string;
  showYesNoDialog: (options: YesNoDialogOptions) => void;
    openDialog: (options: OpenDialogOptions) => void;
    setIsOpen: (isOpen: boolean) => void;
    closeDialog: () => void;
};

const DialogContext = createContext<TDialogContext>({} as TDialogContext);

export const UseDialogContext = () => {
  return useContext(DialogContext);
};



export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [renderContent, setRenderContent] = useState<ReactNode>(null);
  const [renderFooter, setRenderFooter] = useState<ReactNode>(null);
  const [description, setDescription] = useState("");
  const [dialogClassName, setDialogClassName] = useState<string | undefined>(undefined);
  const [contentClassName, setContentClassName] = useState<string | undefined>(undefined);

  const resetDialogState = useCallback(() => {
    setTitle("");
    setDescription("");
    setRenderContent(null);
    setRenderFooter(null);
    setDialogClassName(undefined);
    setContentClassName(undefined);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    resetDialogState();
  }, [resetDialogState]);

  const showYesNoDialog = ({ handleYes, handleNo, title, description, requiresReloadOnYes }: YesNoDialogOptions) => {
    setDescription(description);
    setTitle(title);
    setRenderFooter(null);
    setRenderContent(
      <ChronoYesNoFormComponent
        onYes={handleYes}
        onNo={handleNo}
        requiresReloadOnYes={requiresReloadOnYes}
      />
    );
    setIsOpen(true);
  };

  const openDialog = ({
    title,
    description,
    content,
    footer,
    dialogClassName,
    contentClassName,
  }: OpenDialogOptions) => {
    setTitle(title);
    setDescription(description);
    setRenderContent(content);
    setRenderFooter(footer ?? null);
    setDialogClassName(dialogClassName);
    setContentClassName(contentClassName);
    setIsOpen(true);
  };

  return (
    <DialogContext.Provider
      value={{
        isOpen,
        title,
        renderContent: renderContent,
        renderFooter,
        showYesNoDialog,
        description,
        dialogClassName,
        contentClassName,
        openDialog,
        setIsOpen,
        closeDialog,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};
