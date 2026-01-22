"use client";

import * as React from "react";

import { ChronoDataTable } from "@chrono/chrono-data-table.component";
import { ChronoPaginator } from "@chrono/chrono-paginator.component";
import { ChronoViewWithTableLayout } from "@chrono/chrono-view-with-table-layout.component";
import ChronoButton from "@/src/shared/components/chrono-soft/chrono-button.component";
import { UseDialogContext } from "@/src/shared/context/dialog.context";
import { toast } from "sonner";
import { X } from "lucide-react";

import type { IPaymentItemEntity } from "@/src/server/domain/entities/parking/payment-list-item.entity";
import { createPaymentColumns } from "./table/columns.component";
import { PaymentDetailDialogContent } from "./payment-detail-dialog-content";
import { usePrint } from "@/src/shared/hooks/common/use-print.hook";

interface Props {
  items: IPaymentItemEntity[];
  total: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
}

export default function PaymentsDataListComponent({
  items,
  total,
  totalPages,
  pageSize,
}: Props) {
  const { openDialog, closeDialog, showYesNoDialog } = UseDialogContext();
  const { printPaymentTicketByPaymentId } = usePrint();

  const handleViewDetail = React.useCallback(
    (item: IPaymentItemEntity) => {
      openDialog({
        title: "Detalle de pago",
        description: "Información del pago seleccionado",
        content: <PaymentDetailDialogContent item={item} />,
        dialogClassName: "w-full sm:max-w-4xl",
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
    [closeDialog, openDialog],
  );

  const handlePrint = React.useCallback(
    async (item: IPaymentItemEntity) => {
      showYesNoDialog({
        title: "Imprimir comprobante",
        description: `¿Desea imprimir el comprobante${item.transactionId ? ` (${item.transactionId})` : ""}?`,
        iconVariant: "warning",
        handleYes: async () => {
          const toastId = toast.loading("Enviando impresión...");
          try {
            const res = await printPaymentTicketByPaymentId(item.id);
            if (!res.success) {
              toast.error("No se pudo imprimir", {
                id: toastId,
                description: res.error || "Verifica el servicio de impresión",
              });
              return;
            }
            toast.success("Impresión enviada", { id: toastId });
          } catch (error) {
            console.error("Error printing payment:", error);
            toast.error("Error inesperado al imprimir", { id: toastId });
          }
        },
        handleNo: async () => {},
      });
    },
    [printPaymentTicketByPaymentId, showYesNoDialog],
  );

  const columns = React.useMemo(
    () => createPaymentColumns(handleViewDetail, handlePrint),
    [handleViewDetail, handlePrint],
  );

  const safeTotalPages = Math.max(1, totalPages || Math.ceil(total / pageSize) || 1);

  return (
    <ChronoViewWithTableLayout
      title="Pagos"
      description="Listado de transacciones/pagos registrados"
      table={(
        <ChronoDataTable
          data={items}
          columns={columns}
          caption={`${total} registros`}
          getRowKey={(row) => row.id}
          emptyMessage="Sin pagos para mostrar"
        />
      )}
      paginator={(
        <ChronoPaginator
          totalPages={safeTotalPages}
          className="flex-col gap-4 p-0 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between"
        />
      )}
    />
  );
}
