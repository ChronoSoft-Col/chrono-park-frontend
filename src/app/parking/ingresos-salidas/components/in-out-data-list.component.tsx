"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { IInOutEntity } from "@/server/domain";
import { ChronoDataTable } from "@chrono/chrono-data-table.component";
import { ChronoPaginator } from "@chrono/chrono-paginator.component";
import { ChronoViewWithTableLayout } from "@chrono/chrono-view-with-table-layout.component";

import { createInOutColumns } from "./table/columns.component";
import { UseDialogContext } from "@/src/shared/context/dialog.context";
import { useCommonContext } from "@/src/shared/context/common.context";
import { InOutDetailDialogContent } from "./in-out-detail-dialog-content";
import { ChangeRateDialogContent } from "./change-rate-dialog-content";
import { usePrint } from "@/src/shared/hooks/common/use-print.hook";
import { toast } from "sonner";
import ChronoButton from "@/src/shared/components/chrono-soft/chrono-button.component";
import ChronoVehicleTypeSelect from "@/src/shared/components/chrono-soft/chrono-vehicle-type-select.component";
import { getEntryTicketAction } from "../actions/get-entry-ticket.action";
import { InOutStatusEnum } from "@/src/shared/enums/parking/in-out-status.enum";

interface Props {
  items: IInOutEntity[];
  total: number;
  totalPages: number;
  pageSize: number;
  error?: string;
}

export default function InOutDataListComponent({
  items,
  total,
  totalPages,
  pageSize,
  error,
}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  const { openDialog, closeDialog, showYesNoDialog } = UseDialogContext();
  const { vehicleTypes = [] } = useCommonContext();
  const { printIncomeReceipt } = usePrint();
  const errorShownRef = React.useRef(false);

  React.useEffect(() => {
    if (error && !errorShownRef.current) {
      errorShownRef.current = true;
      toast.error("Error al cargar datos", {
        description: error,
      });
    }
  }, [error]);

  const currentStatus = (searchParams.get("status") as InOutStatusEnum | null) ?? InOutStatusEnum.ACTIVE;
  const currentVehicleTypeId = searchParams.get("vehicleTypeId") ?? "all";
  const isEntriesTab = currentStatus === InOutStatusEnum.ACTIVE;

  const buildUrl = React.useCallback(
    (nextParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(nextParams).forEach(([key, value]) => params.set(key, value));
      const queryString = params.toString();
      return queryString ? `${pathname}?${queryString}` : pathname;
    },
    [pathname, searchParams],
  );

  const setStatus = React.useCallback(
    (status: InOutStatusEnum) => {
      if (pending) return;
      if (status === currentStatus) return;
      startTransition(() => {
        router.replace(
          buildUrl({
            status,
            page: "1",
          }),
        );
      });
    },
    [buildUrl, currentStatus, pending, router],
  );

  const setVehicleTypeId = React.useCallback(
    (vehicleTypeId: string) => {
      if (pending) return;
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (!vehicleTypeId || vehicleTypeId === "all") {
          params.delete("vehicleTypeId");
        } else {
          params.set("vehicleTypeId", vehicleTypeId);
        }
        params.set("page", "1");
        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname);
      });
    },
    [pathname, pending, router, searchParams],
  );

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
          const toastId = toast.loading("Obteniendo información del ticket...");
          try {
            const ticketResponse = await getEntryTicketAction(item.id);
            if (!ticketResponse.success || !ticketResponse.data) {
              toast.error(
                ticketResponse.error ||
                  "No se pudo obtener la información del ticket",
                { id: toastId },
              );
              return;
            }

            toast.loading("Enviando impresión...", { id: toastId });
            const res = await printIncomeReceipt(ticketResponse.data);
            if (!res.success) {
              toast.error("No se pudo imprimir el ticket de ingreso", { id: toastId });
              return;
            }
            toast.success("Ticket de ingreso enviado a la impresora", { id: toastId });
          } catch (error) {
            console.error("Error printing entry ticket:", error);
            toast.error("Error inesperado al imprimir", { id: toastId });
          }
        },
        handleNo: async () => {},
      });
    },
    [printIncomeReceipt, showYesNoDialog],
  );

  const handleChangeRate = React.useCallback(
    (item: IInOutEntity) => {
      openDialog({
        title: `Cambiar tarifa - ${item.vehicle.licensePlate}`,
        description: "Seleccione la nueva tarifa a aplicar",
        dialogClassName: "w-full sm:max-w-lg",
        content: (
          <ChangeRateDialogContent
            item={item}
            onClose={closeDialog}
            onSuccess={() => {
              router.refresh();
            }}
          />
        ),
      });
    },
    [openDialog, closeDialog, router],
  );

  const columns = React.useMemo(
    () => createInOutColumns(handleViewDetail, handlePrint, {
      onChangeRate: handleChangeRate,
      showChangeRate: isEntriesTab,
    }),
    [handleViewDetail, handlePrint, handleChangeRate, isEntriesTab],
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
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <ChronoButton
              type="button"
              variant={isEntriesTab ? "default" : "secondary"}
              disabled={pending}
              onClick={() => setStatus(InOutStatusEnum.ACTIVE)}
            >
              Entradas
            </ChronoButton>
            <ChronoButton
              type="button"
              variant={!isEntriesTab ? "default" : "secondary"}
              disabled={pending}
              onClick={() => setStatus(InOutStatusEnum.INACTIVE)}
            >
              Salidas
            </ChronoButton>

            <div className="ml-auto w-[240px]">
              <ChronoVehicleTypeSelect
                value={currentVehicleTypeId === "all" ? "" : currentVehicleTypeId}
                onValueChange={setVehicleTypeId}
                options={vehicleTypes}
                placeholder="Tipo de vehículo"
                disabled={pending}
              />
            </div>
          </div>

          <ChronoDataTable
            data={items}
            columns={columns}
            caption={`${total} registros`}
            getRowKey={(row) => row.id}
            emptyMessage="Sin registros para mostrar"
            isLoading={pending}
          />
        </div>
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
