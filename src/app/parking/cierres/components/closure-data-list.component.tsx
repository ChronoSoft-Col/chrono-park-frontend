"use client";

import { IClosureListItemEntity } from "@/server/domain/entities/parking/closure-list-item.entity";
import { ChronoDataTable } from "@/src/shared/components/chrono-soft/chrono-data-table.component";
import { ChronoPaginator } from "@/src/shared/components/chrono-soft/chrono-paginator.component";
import { Button } from "@/src/shared/components/ui/button";
import { UseDialogContext } from "@/src/shared/context/dialog.context";
import { usePrint } from "@/src/shared/hooks/common/use-print.hook";
import { useCallback, useMemo, useRef } from "react";
import { ClosureDetailDialog } from "./closure-detail-dialog.component";
import { createClosureColumns } from "./table/columns.component";
import { getClosureByIdAction } from "../actions/get-closure-by-id.action";
import { toast } from "sonner";

interface Props {
  items: IClosureListItemEntity[];
  total: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
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
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={closeDialog}>
              Cerrar
            </Button>
            <Button
              onClick={async () => {
                const printRes = await printClosureReceipt(closureDetail);
                if (!printRes.success) toast.error("No se pudo imprimir el cierre");
              }}
            >
              Reimprimir
            </Button>
          </div>
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
    <section className="space-y-6">
      <div className="rounded-3xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur">
        <ChronoDataTable
          columns={columns}
          data={items}
          caption={`${total} registros`}
          getRowKey={(row) => row.id}
          emptyMessage="Sin cierres para mostrar"
        />
      </div>

      <div className="rounded-2xl border border-dashed border-border/60 bg-muted/40 p-4">
        <ChronoPaginator
          totalPages={safeTotalPages}
          className="flex-col gap-4 p-0 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between"
        />
      </div>
    </section>
  );
}


