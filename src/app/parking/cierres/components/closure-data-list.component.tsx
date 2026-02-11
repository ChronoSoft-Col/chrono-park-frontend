"use client";

import type { IClosureEntity } from "@/server/domain/entities/parking/closures/closure.entity";
import { IClosureListItemEntity } from "@/server/domain/entities/parking/closures/closure-list-item.entity";
import { ChronoDataTable } from "@/src/shared/components/chrono-soft/chrono-data-table.component";
import { ChronoPaginator } from "@/src/shared/components/chrono-soft/chrono-paginator.component";
import { ChronoViewWithTableLayout } from "@chrono/chrono-view-with-table-layout.component";
import { UseDialogContext } from "@/src/shared/context/dialog.context";
import { usePrint } from "@/src/shared/hooks/common/use-print.hook";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { ClosureDetailDialog } from "./closure-detail-dialog.component";
import { createClosureColumns } from "./table/columns.component";
import { getClosureByIdAction } from "../actions/get-closure-by-id.action";
import { toast } from "sonner";
import ChronoButton from "@chrono/chrono-button.component";
import { Plus } from "lucide-react";
import CreateClosureDialogContent from "./create-closure-dialog.component";

interface Props {
  items: IClosureListItemEntity[];
  total: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
  error?: string;
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
  const { showYesNoDialog } = UseDialogContext();

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
      <ChronoButton variant="outline" onClick={onClose}>
        Cerrar
      </ChronoButton>
      <ChronoButton
        variant="default"
        onClick={async () => {
          showYesNoDialog({
            title: "Imprimir cierre",
            description: "¿Desea imprimir el comprobante del cierre de caja?",
            iconVariant: "warning",
            handleYes: async () => {
              const toastId = toast.loading("Enviando impresión...");
              try {
                const printRes = await onPrint(closure, { operatorName });
                if (!printRes.success) {
                  toast.error("Error al imprimir el cierre", { id: toastId });
                  return;
                }

                toast.success("Impresión enviada correctamente", { id: toastId });
              } catch (error) {
                console.error("Error printing closure:", error);
                toast.error("Error inesperado al imprimir el cierre", { id: toastId });
              }
            },
            handleNo: async () => {},
          });
        }}
      >
        Imprimir
      </ChronoButton>
    </div>
  );
}

export default function ClosureDataListComponent({
  items,
  total,
  totalPages,
  pageSize,
  error,
}: Props) {
  const { openDialog, closeDialog, showYesNoDialog } = UseDialogContext();
  const { printClosureReceipt } = usePrint();
  const detailRequestInFlightRef = useRef(false);
  const printRequestInFlightRef = useRef(false);
  const errorShownRef = useRef(false);

  useEffect(() => {
    if (error && !errorShownRef.current) {
      errorShownRef.current = true;
      toast.error("Error al cargar datos", {
        description: error,
      });
    }
  }, [error]);

  const handleOpenCreateClosure = useCallback(() => {
    openDialog({
      title: "Crear Nuevo Cierre de Caja",
      description: "",
      content: <CreateClosureDialogContent />,
    });
  }, [openDialog]);

  const handleViewDetail = useCallback(async (closure: IClosureListItemEntity) => {
    if (detailRequestInFlightRef.current) return;

    detailRequestInFlightRef.current = true;
    const toastId = toast.loading("Cargando detalle del cierre...");
    try {
      const res = await getClosureByIdAction(closure.id);
      if (!res.success || !res.data) {
        toast.error(res.error || "No se pudo cargar el detalle del cierre", { id: toastId });
        return;
      }
      
      toast.success("Detalle cargado", { id: toastId });
      const closureDetail = res.data;

      openDialog({
        title: "Detalle del cierre",
        description: "",
        dialogClassName: "w-full sm:max-w-3xl",
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
      toast.error("Error inesperado al cargar el detalle del cierre", { id: toastId });
    } finally {
      detailRequestInFlightRef.current = false;
    }
  }, [closeDialog, openDialog, printClosureReceipt]);

  const handlePrint = useCallback((closure: IClosureListItemEntity) => {
    if (printRequestInFlightRef.current) return;

    showYesNoDialog({
      title: "Imprimir cierre",
      description: "Se consultará el detalle del cierre y se enviará a imprimir.",
      iconVariant: "warning",
      handleYes: async () => {
        printRequestInFlightRef.current = true;
        const toastId = toast.loading("Consultando detalle e imprimiendo...");
        try {
          const res = await getClosureByIdAction(closure.id);
          if (!res.success || !res.data) {
            toast.error(res.error || "No se pudo cargar el detalle del cierre", {
              id: toastId,
            });
            return;
          }

          const printRes = await printClosureReceipt(res.data, {
            operatorName: closure.operatorName,
          });

          if (!printRes.success) {
            toast.error("Error al imprimir el cierre", { id: toastId });
            return;
          }

          toast.success("Impresión enviada correctamente", { id: toastId });
        } catch (error) {
          console.error("Error printing closure:", error);
          toast.error("Error inesperado al imprimir el cierre", { id: toastId });
        } finally {
          printRequestInFlightRef.current = false;
        }
      },
      handleNo: async () => {},
    });
  }, [printClosureReceipt, showYesNoDialog]);

  const columns = useMemo(
    () => createClosureColumns(handleViewDetail, handlePrint),
    [handlePrint, handleViewDetail]
  );

  const safeTotalPages = Math.max(1, totalPages || Math.ceil(total / pageSize) || 1);

  return (
    <ChronoViewWithTableLayout
      title="Cierres de caja"
      description="Lista de cierres registrados en el sistema"
      action={{
        label: "Nuevo cierre",
        icon: <Plus className="h-4 w-4" />,
        onClick: handleOpenCreateClosure,
      }}
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


