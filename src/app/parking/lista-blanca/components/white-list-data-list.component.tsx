"use client";

import * as React from "react";

import type { IWhiteListEntity } from "@/server/domain";
import { ChronoDataTable } from "@chrono/chrono-data-table.component";
import { ChronoPaginator } from "@chrono/chrono-paginator.component";
import { ChronoViewWithTableLayout } from "@chrono/chrono-view-with-table-layout.component";

import { UseDialogContext } from "@/src/shared/context/dialog.context";
import ChronoButton from "@/src/shared/components/chrono-soft/chrono-button.component";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

import { createWhiteListColumns } from "./table/columns.component";
import { WhiteListDetailDialogContent } from "./white-list-detail-dialog-content";
import { CreateWhiteListDialogContent } from "./create-white-list-dialog.component";
import { EditWhiteListDialogContent } from "./edit-white-list-dialog.component";
import { deactivateWhiteListAction } from "../actions/deactivate-white-list.action";
import { ListaBlancaAction } from "@/src/shared/enums/auth/permissions.enum";

interface Props {
  items: IWhiteListEntity[];
  total: number;
  totalPages: number;
  pageSize: number;
  error?: string;
}

export default function WhiteListDataListComponent({
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
    async (item: IWhiteListEntity) => {
      const toastId = toast.loading("Desactivando registro...");
      try {
        const res = await deactivateWhiteListAction(item.id);
        if (!res.success) {
          toast.error(res.error || "No se pudo desactivar el registro", { id: toastId });
          return;
        }
        toast.success("Registro desactivado correctamente", { id: toastId });
        closeDialog();
      } catch (error) {
        console.error("Error deactivating white list entry:", error);
        toast.error("Error inesperado al desactivar el registro", { id: toastId });
      }
    },
    [closeDialog],
  );

  const handleEdit = React.useCallback(
    (item: IWhiteListEntity) => {
      openDialog({
        title: "Editar registro de lista blanca",
        description: "",
        content: <EditWhiteListDialogContent item={item} />,
        dialogClassName: "w-full sm:max-w-xl",
        contentClassName: "max-h-[75vh] overflow-y-auto pr-1",
      });
    },
    [openDialog],
  );

  const handleOpenCreate = React.useCallback(() => {
    openDialog({
      title: "Agregar a lista blanca",
      description: "Registra un nuevo vehículo o cliente en la lista blanca",
      content: <CreateWhiteListDialogContent />,
      dialogClassName: "w-full sm:max-w-xl",
      contentClassName: "max-h-[75vh] overflow-y-auto pr-1",
    });
  }, [openDialog]);

  const handleViewDetail = React.useCallback(
    (item: IWhiteListEntity) => {
      openDialog({
        title: "Detalle de lista blanca",
        description: "Información del registro seleccionado",
        content: <WhiteListDetailDialogContent item={item} />,
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
    (item: IWhiteListEntity) => {
      if (!item.isActive) {
        toast.message("El registro ya está inactivo");
        return;
      }

      showYesNoDialog({
        title: "Desactivar registro",
        description: "¿Deseas desactivar este registro de la lista blanca?",
        requiresReloadOnYes: true,
        handleNo: closeDialog,
        handleYes: () => handleDeactivateYes(item),
      });
    },
    [closeDialog, handleDeactivateYes, showYesNoDialog],
  );

  const columns = React.useMemo(
    () => createWhiteListColumns(handleViewDetail, handleEdit, handleDeactivate),
    [handleViewDetail, handleEdit, handleDeactivate],
  );

  const safeTotalPages = Math.max(1, totalPages || Math.ceil(total / pageSize) || 1);

  return (
    <ChronoViewWithTableLayout
      title="Lista Blanca"
      description="Vehículos y clientes exentos de restricciones de acceso"
      action={{
        label: "Agregar registro",
        icon: <Plus className="h-4 w-4" />,
        onClick: handleOpenCreate,
        permission: ListaBlancaAction.CREAR_LISTA_BLANCA,
      }}
      table={
        <ChronoDataTable
          data={items}
          columns={columns}
          caption={`${total} registros`}
          getRowKey={(row) => row.id}
          emptyMessage="Sin registros en lista blanca"
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
