"use client";

import * as React from "react";

import { IInOutEntity } from "@/server/domain";
import { ChronoDataTable } from "@chrono/chrono-data-table.component";
import { ChronoPaginator } from "@chrono/chrono-paginator.component";

import { createInOutColumns } from "./table/columns.component";
import { UseDialogContext } from "@/src/shared/context/dialog.context";
import { InOutDetailDialogContent } from "./in-out-detail-dialog-content";

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
  const { openDialog } = UseDialogContext();

  const handleViewDetail = React.useCallback(
    (item: IInOutEntity) => {
      openDialog({
        title: `Detalle de ${item.vehicle.licensePlate}`,
        description: "Información detallada del movimiento seleccionado",
        content: <InOutDetailDialogContent item={item} />,
      });
    },
    [openDialog]
  );

  const columns = React.useMemo(() => createInOutColumns(handleViewDetail), [handleViewDetail]);
  const safeTotalPages = Math.max(1, totalPages || Math.ceil(total / pageSize) || 1);
  return (
    <section className="space-y-6">

      <div className="rounded-3xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur">
        <ChronoDataTable
          data={items}
          columns={columns}
          caption={`${total} registros`}
          getRowKey={(row) => row.id}
          emptyMessage="Sin registros para mostrar"
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