"use client";

import * as React from "react";

import type { ICustomerEntity } from "@/server/domain";
import { ChronoDataTable } from "@chrono/chrono-data-table.component";
import { ChronoPaginator } from "@chrono/chrono-paginator.component";
import { ChronoViewWithTableLayout } from "@chrono/chrono-view-with-table-layout.component";

import { UseDialogContext } from "@/src/shared/context/dialog.context";
import ChronoButton from "@/src/shared/components/chrono-soft/chrono-button.component";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

import { createCustomerColumns } from "./table/columns.component";
import { CustomersDetailDialogContent } from "./customers-detail-dialog-content";
import { CreateCustomerDialogContent } from "./create-customer-dialog.component";
import { setCustomerActiveAction } from "../actions/set-customer-active.action";
import { deleteCustomerAction } from "../actions/delete-customer.action";
import { EditCustomerDialogContent } from "./edit-customer-dialog.component";

interface Props {
  items: ICustomerEntity[];
  total: number;
  totalPages: number;
  pageSize: number;
  error?: string;
}

export default function CustomersDataListComponent({
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

  const handleToggleActiveYes = React.useCallback(
    async (item: ICustomerEntity, nextActive: boolean) => {
      const toastId = toast.loading("Actualizando cliente...");
      try {
        const res = await setCustomerActiveAction(item.id, nextActive);
        if (!res.success) {
          toast.error(res.error || "No se pudo actualizar el estado", { id: toastId });
          return;
        }

        const ok = (res.data as { success?: boolean } | undefined)?.success;
        if (ok === false) {
          toast.error("No se pudo actualizar el estado", { id: toastId });
          return;
        }

        toast.success(
          `Cliente ${nextActive ? "activado" : "desactivado"} correctamente`,
          { id: toastId },
        );
        closeDialog();
      } catch (error) {
        console.error("Error updating customer status:", error);
        toast.error("Error inesperado al actualizar el cliente", { id: toastId });
      }
    },
    [closeDialog],
  );

  const handleDeleteYes = React.useCallback(
    async (item: ICustomerEntity) => {
      const toastId = toast.loading("Eliminando cliente...");
      try {
        const res = await deleteCustomerAction(item.id);
        if (!res.success) {
          toast.error(res.error || "No se pudo eliminar", { id: toastId });
          return;
        }

        const ok = (res.data as { success?: boolean } | undefined)?.success;
        if (ok === false) {
          toast.error("No se pudo eliminar", { id: toastId });
          return;
        }

        toast.success("Cliente eliminado", { id: toastId });
        closeDialog();
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast.error("Error inesperado al eliminar el cliente", { id: toastId });
      }
    },
    [closeDialog],
  );

  const handleEdit = React.useCallback(
    (item: ICustomerEntity) => {
      openDialog({
        title: `Editar ${item.fullName}`,
        description: "",
        content: <EditCustomerDialogContent customer={item} />,
        dialogClassName: "w-full sm:max-w-5xl",
        contentClassName: "max-h-[75vh] overflow-y-auto pr-1",
      });
    },
    [openDialog],
  );

  const handleOpenCreateCustomer = React.useCallback(() => {
    openDialog({
      title: "Crear cliente",
      description: "Registra un nuevo cliente y sus vehículos",
      content: <CreateCustomerDialogContent />,
      dialogClassName: "w-full sm:max-w-5xl",
      contentClassName: "max-h-[75vh] overflow-y-auto pr-1",
    });
  }, [openDialog]);

  const handleViewDetail = React.useCallback(
    (item: ICustomerEntity) => {
      openDialog({
        title: `Detalle de ${item.fullName}`,
        description: "Información del cliente seleccionado",
        content: <CustomersDetailDialogContent item={item} />,
        footer: (
          <ChronoButton
            onClick={closeDialog}
            variant={"outline"}
            iconPosition="left"
            icon={<X/>}
            size={"lg"}
          >
            Cerrar
          </ChronoButton>
        ),
      });
    },
    [openDialog, closeDialog],
  );

  const handleToggleActive = React.useCallback(
    (item: ICustomerEntity, nextActive: boolean) => {
      const title = nextActive ? "Activar cliente" : "Desactivar cliente";
      const verb = nextActive ? "activar" : "desactivar";

      showYesNoDialog({
        title,
        description: `¿Deseas ${verb} a ${item.fullName}?`,
        requiresReloadOnYes: true,
        handleNo: closeDialog,
        handleYes: () => handleToggleActiveYes(item, nextActive),
      });
    },
    [closeDialog, handleToggleActiveYes, showYesNoDialog],
  );

  const handleDelete = React.useCallback(
    (item: ICustomerEntity) => {
      if (!item.isActive) {
        toast.message("El cliente ya está inactivo");
        return;
      }

      showYesNoDialog({
        title: "Eliminar cliente",
        description: `¿Deseas eliminar a ${item.fullName}?`,
        requiresReloadOnYes: true,
        handleNo: closeDialog,
        handleYes: () => handleDeleteYes(item),
      });
    },
    [closeDialog, handleDeleteYes, showYesNoDialog],
  );

  const columns = React.useMemo(
    () => createCustomerColumns(handleViewDetail, handleToggleActive, handleDelete, handleEdit),
    [handleViewDetail, handleToggleActive, handleDelete, handleEdit],
  );
  const safeTotalPages = Math.max(
    1,
    totalPages || Math.ceil(total / pageSize) || 1,
  );

  return (
    <ChronoViewWithTableLayout
      title="Clientes"
      description="Lista de clientes registrados en el sistema"
      action={{
        label: "Crear cliente",
        icon: <Plus className="h-4 w-4" />,
        onClick: handleOpenCreateCustomer,
      }}
      table={
        <ChronoDataTable
          data={items}
          columns={columns}
          caption={`${total} registros`}
          getRowKey={(row) => row.id}
          emptyMessage="Sin clientes para mostrar"
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
