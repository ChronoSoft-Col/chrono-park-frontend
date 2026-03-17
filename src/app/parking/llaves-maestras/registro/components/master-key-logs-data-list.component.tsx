"use client";

import * as React from "react";

import type { IMasterKeyLogEntity } from "@/server/domain";
import { ChronoDataTable } from "@chrono/chrono-data-table.component";
import { ChronoPaginator } from "@chrono/chrono-paginator.component";
import { ChronoViewWithTableLayout } from "@chrono/chrono-view-with-table-layout.component";

import { UseDialogContext } from "@/src/shared/context/dialog.context";
import ChronoButton from "@/src/shared/components/chrono-soft/chrono-button.component";
import { X } from "lucide-react";
import { toast } from "sonner";

import { createMasterKeyLogColumns } from "./table/columns.component";
import { MasterKeyLogDetailDialogContent } from "./master-key-log-detail-dialog-content";

interface Props {
  items: IMasterKeyLogEntity[];
  total: number;
  totalPages: number;
  pageSize: number;
  error?: string;
}

export default function MasterKeyLogsDataListComponent({
  items,
  total,
  totalPages,
  pageSize,
  error,
}: Props) {
  const { openDialog, closeDialog } = UseDialogContext();
  const errorShownRef = React.useRef(false);

  React.useEffect(() => {
    if (error && !errorShownRef.current) {
      errorShownRef.current = true;
      toast.error("Error al cargar datos", {
        description: error,
      });
    }
  }, [error]);

  const handleViewDetail = React.useCallback(
    (item: IMasterKeyLogEntity) => {
      openDialog({
        title: "Detalle de uso de llave maestra",
        description: "Información del registro seleccionado",
        content: <MasterKeyLogDetailDialogContent item={item} />,
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

  const columns = React.useMemo(() => createMasterKeyLogColumns(handleViewDetail), [handleViewDetail]);

  const safeTotalPages = Math.max(1, totalPages || Math.ceil(total / pageSize) || 1);

  return (
    <ChronoViewWithTableLayout
      title="Registros de Llaves Maestras"
      description="Historial de usos de llaves maestras en dispositivos"
      table={
        <ChronoDataTable
          data={items}
          columns={columns}
          caption={`${total} registros`}
          getRowKey={(row) => row.id}
          emptyMessage="Sin registros de uso de llaves maestras"
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
