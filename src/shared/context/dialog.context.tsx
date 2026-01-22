"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import ChronoYesNoFormComponent from "@chrono/chrono-yes-no-form.component";
import { Separator } from "../components/ui/separator";

type DialogProviderProps = {
  children: ReactNode;
};

type YesNoDialogOptions = {
  handleYes: () => void | Promise<void>;
  handleNo: () => void | Promise<void>;
  title: string;
  description: string;
  requiresReloadOnYes?: boolean;
  showIcon?: boolean;
  icon?: ReactNode;
  iconVariant?: "alert" | "warning" | "info" | "success";
};

const getYesNoIconStyles = (
  variant: NonNullable<YesNoDialogOptions["iconVariant"]>,
) => {
  switch (variant) {
    case "success":
      return {
        containerClassName: "bg-emerald-500/10 text-emerald-600",
        defaultIcon: <CheckCircle2 className="size-10" />,
      };
    case "info":
      return {
        containerClassName: "bg-sky-500/10 text-sky-600",
        defaultIcon: <Info className="size-10" />,
      };
    case "warning":
      return {
        containerClassName: "bg-amber-500/10 text-amber-700",
        defaultIcon: <AlertTriangle className="size-10" />,
      };
    case "alert":
    default:
      return {
        containerClassName: "bg-destructive/10 text-destructive",
        defaultIcon: <AlertTriangle className="size-10" />,
      };
  }
};

type OpenDialogOptions = {
  title: string;
  description: string;
  content: ReactNode;
  footer?: ReactNode;
  dialogClassName?: string;
  contentClassName?: string;
  headerIcon?: ReactNode;
};

type TDialogContext = {
  isOpen: boolean;
  title: string;
  description: string;
  renderContent: ReactNode;
  renderFooter: ReactNode;
  dialogClassName?: string;
  contentClassName?: string;
  headerIcon?: ReactNode;
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
  const [dialogClassName, setDialogClassName] = useState<string | undefined>(
    undefined,
  );
  const [contentClassName, setContentClassName] = useState<string | undefined>(
    undefined,
  );
  const [headerIcon, setHeaderIcon] = useState<ReactNode>(null);

  const resetDialogState = useCallback(() => {
    setTitle("");
    setDescription("");
    setRenderContent(null);
    setRenderFooter(null);
    setDialogClassName(undefined);
    setContentClassName(undefined);
    setHeaderIcon(null);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    resetDialogState();
  }, [resetDialogState]);

  const showYesNoDialog = ({
    handleYes,
    handleNo,
    title,
    description,
    requiresReloadOnYes,
    showIcon = true,
    icon,
    iconVariant = "alert",
  }: YesNoDialogOptions) => {
    setDescription(description);
    setTitle(title);
    setRenderFooter(null);

    const iconStyles = getYesNoIconStyles(iconVariant);
    const resolvedIcon = icon ?? iconStyles.defaultIcon;

    setHeaderIcon(
      showIcon ? (
        <div className="flex items-center justify-center flex-col py-4 gap-4">
          <div
            className={`flex size-16 items-center justify-center rounded-full ${iconStyles.containerClassName}`}
            aria-hidden
          >
            {resolvedIcon}
          </div>

          <Separator className="w-full" />
        </div>
      ) : null,
    );

    setRenderContent(
      <div className="py-2">
        <ChronoYesNoFormComponent
          onYes={handleYes}
          onNo={handleNo}
          requiresReloadOnYes={requiresReloadOnYes}
        />
      </div>,
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
    headerIcon,
  }: OpenDialogOptions) => {
    setTitle(title);
    setDescription(description);
    setRenderContent(content);
    setRenderFooter(footer ?? null);
    setDialogClassName(dialogClassName);
    setContentClassName(contentClassName);
    setHeaderIcon(headerIcon ?? null);
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
        headerIcon,
        openDialog,
        setIsOpen,
        closeDialog,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};
