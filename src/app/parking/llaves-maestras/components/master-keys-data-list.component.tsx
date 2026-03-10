"use client";

import * as React from "react";

import type { IMasterKeyEntity } from "@/server/domain";
import { ChronoDataTable } from "@chrono/chrono-data-table.component";
import { ChronoPaginator } from "@chrono/chrono-paginator.component";
import { ChronoViewWithTableLayout } from "@chrono/chrono-view-with-table-layout.component";

import { UseDialogContext } from "@/src/shared/context/dialog.context";
import ChronoButton from "@/src/shared/components/chrono-soft/chrono-button.component";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

import { createMasterKeyColumns } from "./table/columns.component";
import { MasterKeyDetailDialogContent } from "./master-key-detail-dialog-content";
import { CreateMasterKeyDialogContent } from "./create-master-key-dialog.component";
import { EditMasterKeyDialogContent } from "./edit-master-key-dialog.component";
import { deactivateMasterKeyAction } from "../actions/deactivate-master-key.action";
import { LlavesMaestrasAction } from "@/src/shared/enums/auth/permissions.enum";

interface Props {
  items: IMasterKeyEntity[];
  total: number;
  totalPages: number;
  pageSize: number;
  error?: string;
}

export default function MasterKeysDataListComponent({
  items,
  total,
  totalPages,
  pageSize,
  error,
}: Props) {
  const { openDialog, closeDialog, showYesNoDialog } = UseDialogContext();
  const errorShownRef = React.useRef(false);

  React.useEffect(() => {
    if (error && !errorShownRef.current) {
      errorShownRef.current = true;
      toast.error("Error al cargar datos", {
        description: error,
      });
    }
  }, [error]);

  const handleDeactivateYes = React.useCallback(
    async (item: IMasterKeyEntity) => {
      const toastId = toast.loading("Desactivando llave maestra...");
      try {
        const res = await deactivateMasterKeyAction(item.id);
        if (!res.success) {
          toast.error(res.error || "No se pudo desactivar la llave", { id: toastId });
          return;
        }
        toast.success("Llave maestra desactivada correctamente", { id: toastId });
        closeDialog();
      } catch (error) {
        console.error("Error deactivating master key:", error);
        toast.error("Error inesperado al desactivar la llave", { id: toastId });
      }
    },
    [closeDialog],
  );

  const handleEdit = React.useCallback(
    (item: IMasterKeyEntity) => {
      openDialog({
        title: "Editar llave maestra",
        description: "",
        content: <EditMasterKeyDialogContent item={item} />,
        dialogClassName: "w-full sm:max-w-md",
        contentClassName: "max-h-[75vh] overflow-y-auto pr-1",
      });
    },
    [openDialog],
  );

  const handleOpenCreate = React.useCallback(() => {
    openDialog({
      title: "Crear llave maestra",
      description: "Registra una nueva llave maestra",
      content: <CreateMasterKeyDialogContent />,
      dialogClassName: "w-full sm:max-w-md",
      contentClassName: "max-h-[75vh] overflow-y-auto pr-1",
    });
  }, [openDialog]);

  const handleViewDetail = React.useCallback(
    (item: IMasterKeyEntity) => {
      openDialog({
        title: "Detalle de llave maestra",
        description: "Información de la llave seleccionada",
        content: <MasterKeyDetailDialogContent item={item} />,
        footer: (
          <ChronoButton
            onClick={closeDialog}
            variant={"outline"}
            iconPosition="left"
            icon={<X />}
            size={"lg"}
          >
            Cerrar
          </ChronoButton>
        ),
      });
    },
    [openDialog, closeDialog],
  );

  const handleDeactivate = React.useCallback(
    (item: IMasterKeyEntity) => {
      if (!item.isActive) {
        toast.message("La llave ya está inactiva");
        return;
      }

      showYesNoDialog({
        title: "Desactivar llave maestra",
        description: "¿Deseas desactivar esta llave maestra?",
        requiresReloadOnYes: true,
        handleNo: closeDialog,
        handleYes: () => handleDeactivateYes(item),
      });
    },
    [closeDialog, handleDeactivateYes, showYesNoDialog],
  );

  const columns = React.useMemo(
    () => createMasterKeyColumns(handleViewDetail, handleEdit, handleDeactivate),
    [handleViewDetail, handleEdit, handleDeactivate],
  );

  const safeTotalPages = Math.max(1, totalPages || Math.ceil(total / pageSize) || 1);

  return (
    <ChronoViewWithTableLayout
      title="Llaves Maestras"
      description="Gestión de llaves maestras del sistema"
      action={{
        label: "Crear llave",
        icon: <Plus className="h-4 w-4" />,
        onClick: handleOpenCreate,
        permission: LlavesMaestrasAction.CREAR_LLAVE_MAESTRA,
      }}
      table={
        <ChronoDataTable
          data={items}
          columns={columns}
          caption={`${total} llaves`}
          getRowKey={(row) => row.id}
          emptyMessage="Sin llaves maestras registradas"
        />
      }
      paginator={
        <ChronoPaginator
          totalPages={safeTotalPages}
          className="flex-col gap-4 p-0 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between"
        />
      }
    />
  );
}
