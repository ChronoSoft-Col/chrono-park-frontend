"use client";

import type { IClosureEntity } from "@/server/domain/entities/parking/closure.entity";
import { IClosureListItemEntity } from "@/server/domain/entities/parking/closure-list-item.entity";
import { ChronoDataTable } from "@/src/shared/components/chrono-soft/chrono-data-table.component";
import { ChronoPaginator } from "@/src/shared/components/chrono-soft/chrono-paginator.component";
import { ChronoViewWithTableLayout } from "@chrono/chrono-view-with-table-layout.component";
import { UseDialogContext } from "@/src/shared/context/dialog.context";
import { usePrint } from "@/src/shared/hooks/common/use-print.hook";
import { useCallback, useMemo, useRef, useState } from "react";
import { ClosureDetailDialog } from "./closure-detail-dialog.component";
import { createClosureColumns } from "./table/columns.component";
import { getClosureByIdAction } from "../actions/get-closure-by-id.action";
import { toast } from "sonner";
import ChronoButton from "@chrono/chrono-button.component";

interface Props {
  items: IClosureListItemEntity[];
  total: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
}

function ClosureDetailFooter({
  closure,
  operatorName,
  onClose,
  onPrint,
}: {
  closure: IClosureEntity;
  operatorName?: string;
  onClose: () => void;
  onPrint: (
    closure: IClosureEntity,
    options?: { operatorName?: string }
  ) => Promise<{ success: boolean }>;
}) {
  const [isPrinting, setIsPrinting] = useState(false);

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
      <ChronoButton variant="outline" onClick={onClose}>
        Cerrar
      </ChronoButton>
      <ChronoButton
        variant="default"
        loading={isPrinting}
        disabled={isPrinting}
        onClick={async () => {
          if (isPrinting) return;
          setIsPrinting(true);

          const toastId = toast.loading("Enviando impresión...");
          try {
            const printRes = await onPrint(closure, { operatorName });
            if (!printRes.success) {
              toast.error("Error al imprimir el cierre", { id: toastId });
              return;
            }

            toast.success("Impresión enviada correctamente", { id: toastId });
          } finally {
            setIsPrinting(false);
          }
        }}
      >
        Reimprimir
      </ChronoButton>
    </div>
  );
}

export default function ClosureDataListComponent({
  items,
  total,
  totalPages,
  pageSize,
}: Props) {
  const { openDialog, closeDialog } = UseDialogContext();
  const { printClosureReceipt } = usePrint();
  const detailRequestInFlightRef = useRef(false);

  const handleViewDetail = useCallback(async (closure: IClosureListItemEntity) => {
    if (detailRequestInFlightRef.current) return;

    detailRequestInFlightRef.current = true;
    try {
      const res = await getClosureByIdAction(closure.id);
      if (!res.success || !res.data) {
        toast.error(res.error || "No se pudo cargar el detalle del cierre");
        return;
      }

      const closureDetail = res.data;

      openDialog({
        title: "Detalle del cierre",
        description: "",
        content: <ClosureDetailDialog closure={closureDetail} operatorName={closure.operatorName} />, 
        footer: (
          <ClosureDetailFooter
            closure={closureDetail}
            operatorName={closure.operatorName}
            onClose={closeDialog}
            onPrint={printClosureReceipt}
          />
        ),
      });
    } catch (error) {
      console.error("Error loading closure detail:", error);
      toast.error("Error inesperado al cargar el detalle del cierre");
    } finally {
      detailRequestInFlightRef.current = false;
    }
  }, [closeDialog, openDialog, printClosureReceipt]);

  const columns = useMemo(() => createClosureColumns(handleViewDetail), [handleViewDetail]);

  const safeTotalPages = Math.max(1, totalPages || Math.ceil(total / pageSize) || 1);

  return (
    <ChronoViewWithTableLayout
      table={(
        <ChronoDataTable
          columns={columns}
          data={items}
          caption={`${total} registros`}
          getRowKey={(row) => row.id}
          emptyMessage="Sin cierres para mostrar"
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


