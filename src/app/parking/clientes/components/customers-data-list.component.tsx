"use client";

import * as React from "react";

import type { ICustomerEntity } from "@/server/domain";
import { ChronoDataTable } from "@chrono/chrono-data-table.component";
import { ChronoPaginator } from "@chrono/chrono-paginator.component";
import { ChronoViewWithTableLayout } from "@chrono/chrono-view-with-table-layout.component";

import { UseDialogContext } from "@/src/shared/context/dialog.context";
import ChronoButton from "@/src/shared/components/chrono-soft/chrono-button.component";
import { Plus } from "lucide-react";

import { createCustomerColumns } from "./table/columns.component";
import { CustomersDetailDialogContent } from "./customers-detail-dialog-content";
import { CreateCustomerDialogContent } from "./create-customer-dialog.component";

interface Props {
  items: ICustomerEntity[];
  total: number;
  totalPages: number;
  pageSize: number;
}

export default function CustomersDataListComponent({
  items,
  total,
  totalPages,
  pageSize,
}: Props) {
  const { openDialog, closeDialog } = UseDialogContext();

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
            className="w-full"
            variant={"secondary"}
          >
            Cerrar
          </ChronoButton>
        ),
      });
    },
    [openDialog, closeDialog],
  );

  const columns = React.useMemo(
    () => createCustomerColumns(handleViewDetail),
    [handleViewDetail],
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
