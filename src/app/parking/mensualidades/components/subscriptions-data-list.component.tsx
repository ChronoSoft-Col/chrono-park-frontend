"use client";

import * as React from "react";

import type { ISubscriptionEntity } from "@/server/domain";
import { ChronoDataTable } from "@chrono/chrono-data-table.component";
import { ChronoPaginator } from "@chrono/chrono-paginator.component";
import { ChronoViewWithTableLayout } from "@chrono/chrono-view-with-table-layout.component";

import { UseDialogContext } from "@/src/shared/context/dialog.context";
import ChronoButton from "@/src/shared/components/chrono-soft/chrono-button.component";
import { Plus, X } from "lucide-react";

import { createSubscriptionColumns } from "./table/columns.component";
import { SubscriptionDetailDialogContent } from "./subscription-detail-dialog-content";
import { SubscriptionHistoryDialogContent } from "./subscription-history-dialog-content";
import { CreateSubscriptionDialogContent } from "./create-subscription-dialog.component";

interface Props {
  items: ISubscriptionEntity[];
  total: number;
  totalPages: number;
  pageSize: number;
}

export default function SubscriptionsDataListComponent({
  items,
  total,
  totalPages,
  pageSize,
}: Props) {
  const { openDialog, closeDialog } = UseDialogContext();

  const handleViewDetail = React.useCallback(
    (item: ISubscriptionEntity) => {
      openDialog({
        title: `Detalle de Mensualidad`,
        description: "Información de la mensualidad seleccionada",
        content: <SubscriptionDetailDialogContent item={item} />,
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
    [openDialog, closeDialog]
  );

  const handleViewHistory = React.useCallback(
    (item: ISubscriptionEntity) => {
      openDialog({
        title: `Historial de Pagos`,
        description: "Historial de suscripciones y pagos del cliente",
        content: (
          <SubscriptionHistoryDialogContent
            customerId={item.customer.id}
            customerName={item.customer.fullName}
          />
        ),
        dialogClassName: "w-full sm:max-w-3xl",
        contentClassName: "max-h-[75vh] overflow-y-auto pr-1",
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
    [openDialog, closeDialog]
  );

  const handleOpenCreateSubscription = React.useCallback(() => {
    openDialog({
      title: "Crear Mensualidad",
      description: "Registra una nueva mensualidad para un cliente",
      content: <CreateSubscriptionDialogContent />,
      dialogClassName: "w-full sm:max-w-5xl",
      contentClassName: "max-h-[75vh] overflow-y-auto pr-1",
    });
  }, [openDialog]);

  const columns = React.useMemo(
    () => createSubscriptionColumns(handleViewDetail, handleViewHistory),
    [handleViewDetail, handleViewHistory]
  );

  const safeTotalPages = Math.max(
    1,
    totalPages || Math.ceil(total / pageSize) || 1
  );

  return (
    <ChronoViewWithTableLayout
      title="Mensualidades"
      description="Lista de suscripciones mensuales registradas en el sistema"
      action={{
        label: "Crear mensualidad",
        icon: <Plus className="h-4 w-4" />,
        onClick: handleOpenCreateSubscription,
      }}
      table={
        <ChronoDataTable
          data={items}
          columns={columns}
          caption={`${total} registros`}
          getRowKey={(row) => row.id}
          emptyMessage="Sin mensualidades para mostrar"
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
