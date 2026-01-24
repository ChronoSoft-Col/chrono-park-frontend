"use client";

import * as React from "react";

import { IInOutEntity } from "@/server/domain";
import { ChronoDataTable } from "@chrono/chrono-data-table.component";
import { ChronoPaginator } from "@chrono/chrono-paginator.component";
import { ChronoViewWithTableLayout } from "@chrono/chrono-view-with-table-layout.component";

import { createInOutColumns } from "./table/columns.component";
import { UseDialogContext } from "@/src/shared/context/dialog.context";
import { InOutDetailDialogContent } from "./in-out-detail-dialog-content";
import { usePrint } from "@/src/shared/hooks/common/use-print.hook";
import { toast } from "sonner";
import ChronoButton from "@/src/shared/components/chrono-soft/chrono-button.component";
import { getEntryTicketAction } from "../actions/get-entry-ticket.action";

interface Props {
  items: IInOutEntity[];
  total: number;
  totalPages: number;
  pageSize: number;
}

export default function InOutDataListComponent({
  items,
  total,
  totalPages,
  pageSize,
}: Props) {
  const { openDialog, closeDialog, showYesNoDialog } = UseDialogContext();
  const { printIncomeReceipt } = usePrint();

  const handleViewDetail = React.useCallback(
    (item: IInOutEntity) => {
      openDialog({
        title: `Detalle de ${item.vehicle.licensePlate}`,
        description: "Información detallada del movimiento seleccionado",
        content: <InOutDetailDialogContent item={item} />,
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

  const handlePrint = React.useCallback(
    async (item: IInOutEntity) => {
      showYesNoDialog({
        title: "Imprimir ticket de ingreso",
        description: `¿Desea imprimir el ticket de ingreso de ${item.vehicle.licensePlate}?`,
        iconVariant: "warning",
        handleYes: async () => {
          const ticketResponse = await getEntryTicketAction(item.id);
          if (!ticketResponse.success || !ticketResponse.data) {
            toast.error(
              ticketResponse.error ||
                "No se pudo obtener la información del ticket",
            );
            return;
          }

          const res = await printIncomeReceipt(ticketResponse.data);
          if (!res.success) {
            toast.error("No se pudo imprimir el ticket de ingreso");
            return;
          }
          toast.success("Ticket de ingreso enviado a la impresora");
        },
        handleNo: async () => {},
      });
    },
    [printIncomeReceipt, showYesNoDialog],
  );

  const columns = React.useMemo(
    () => createInOutColumns(handleViewDetail, handlePrint),
    [handleViewDetail, handlePrint],
  );
  const safeTotalPages = Math.max(
    1,
    totalPages || Math.ceil(total / pageSize) || 1,
  );
  return (
    <ChronoViewWithTableLayout
      title="Ingresos y Salidas"
      description="Lista de ingresos y salidas de vehículos en el sistema"
      table={
        <ChronoDataTable
          data={items}
          columns={columns}
          caption={`${total} registros`}
          getRowKey={(row) => row.id}
          emptyMessage="Sin registros para mostrar"
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
