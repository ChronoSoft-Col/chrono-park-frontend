"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import type { ISubscriptionEntity } from "@/server/domain";
import { ChronoDataTable } from "@chrono/chrono-data-table.component";
import { ChronoPaginator } from "@chrono/chrono-paginator.component";
import { ChronoViewWithTableLayout } from "@chrono/chrono-view-with-table-layout.component";

import { UseDialogContext } from "@/src/shared/context/dialog.context";
import ChronoButton from "@/src/shared/components/chrono-soft/chrono-button.component";
import { Plus, X } from "lucide-react";
import { StatusFilterComponent } from "./status-filter.component";

import { toast } from "sonner";

import { createSubscriptionColumns } from "./table/columns.component";
import { SubscriptionDetailDialogContent } from "./subscription-detail-dialog-content";
import { SubscriptionHistoryDialogContent } from "./subscription-history-dialog-content";
import { CreateSubscriptionDialogContent } from "./create-subscription-dialog.component";
import { EditSubscriptionDialogContent } from "./edit-subscription-dialog.component";
import { ActivateSubscriptionDialogContent } from "./activate-subscription-dialog.component";
import {
  PaySubscriptionDialogContent,
  PAY_SUBSCRIPTION_DIALOG_FORM_ID,
} from "./pay-subscription-dialog.component";
import { PaySubscriptionDialogFooter } from "./pay-subscription-dialog-footer.component";
import { cancelSubscriptionAction } from "../actions/cancel-subscription.action";
import { MensualidadesAction } from "@/src/shared/enums/auth/permissions.enum";

interface Props {
  items: ISubscriptionEntity[];
  total: number;
  totalPages: number;
  pageSize: number;
  error?: string;
}

export default function SubscriptionsDataListComponent({
  items,
  total,
  totalPages,
  pageSize,
  error,
}: Props) {
  const router = useRouter();
  const { openDialog, closeDialog, showYesNoDialog } = UseDialogContext();
  const errorShownRef = React.useRef(false);
  const [cancellingId, setCancellingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (error && !errorShownRef.current) {
      errorShownRef.current = true;
      toast.error("Error al cargar datos", {
        description: error,
      });
    }
  }, [error]);

  const handleViewDetail = React.useCallback(
    (item: ISubscriptionEntity) => {
      openDialog({
        title: `Detalle de Mensualidad`,
        description: "Información de la mensualidad seleccionada",
        dialogClassName: "w-full sm:max-w-2xl",
        contentClassName: "max-h-[75vh] overflow-y-auto pr-1",
        content: (
          <SubscriptionDetailDialogContent
            subscriptionId={item.id}
            fallback={item}
          />
        ),
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
      const customerName = item.customer
        ? `${item.customer.firstName} ${item.customer.lastName}`.trim()
        : "-";
      openDialog({
        title: `Historial de Pagos`,
        description: "Historial de suscripciones y pagos del cliente",
        content: (
          <SubscriptionHistoryDialogContent
            customerId={item.customer?.id ?? ""}
            customerName={customerName}
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

  const handlePaySubscription = React.useCallback(
    (item: ISubscriptionEntity) => {
      openDialog({
        title: "Pagar Suscripción",
        description: "Complete el pago para activar la suscripción",
        dialogClassName: "w-full sm:max-w-5xl",
        content: <PaySubscriptionDialogContent subscription={item} />,
        footer: <PaySubscriptionDialogFooter formId={PAY_SUBSCRIPTION_DIALOG_FORM_ID} />,
      });
    },
    [openDialog]
  );

  const handleCancelSubscription = React.useCallback(
    (item: ISubscriptionEntity) => {
      if (cancellingId) return;

      showYesNoDialog({
        title: "Cancelar suscripción",
        description: "¿Está seguro de cancelar esta suscripción?",
        iconVariant: "alert",
        handleYes: async () => {
          setCancellingId(item.id);
          const toastId = toast.loading("Cancelando suscripción...");
          try {
            const result = await cancelSubscriptionAction(item.id, {
              reason: "Cancelado por el usuario",
            });
            if (result.success && result.data?.success) {
              toast.success("Suscripción cancelada", { id: toastId });
              router.refresh();
            } else {
              toast.error(result.error || "Error al cancelar la suscripción", {
                id: toastId,
              });
            }
          } catch (error) {
            console.error("Error cancelling subscription:", error);
            toast.error("Error al cancelar la suscripción", { id: toastId });
          } finally {
            setCancellingId(null);
          }
        },
        handleNo: () => {},
      });
    },
    [cancellingId, router, showYesNoDialog]
  );

  const handleActivateSubscription = React.useCallback(
    (item: ISubscriptionEntity) => {
      openDialog({
        title: "Activar Suscripción",
        description: "Activar la suscripción seleccionada",
        dialogClassName: "w-full sm:max-w-2xl",
        contentClassName: "max-h-[75vh] overflow-y-auto pr-1",
        content: <ActivateSubscriptionDialogContent subscription={item} />,
      });
    },
    [openDialog]
  );

  const handleEditSubscription = React.useCallback(
    (item: ISubscriptionEntity) => {
      openDialog({
        title: "Editar Mensualidad",
        description: "Editar fecha de fin y/o estado (según permisos)",
        dialogClassName: "w-full sm:max-w-2xl",
        contentClassName: "max-h-[75vh] overflow-y-auto pr-1",
        content: <EditSubscriptionDialogContent subscription={item} />,
      });
    },
    [openDialog]
  );

  const columns = React.useMemo(
    () =>
      createSubscriptionColumns(
        handleViewDetail,
        handleViewHistory,
        handlePaySubscription,
        handleCancelSubscription,
        handleActivateSubscription,
        handleEditSubscription,
        (item) => cancellingId === item.id,
      ),
    [
      handleViewDetail,
      handleViewHistory,
      handlePaySubscription,
      handleCancelSubscription,
      handleActivateSubscription,
      handleEditSubscription,
      cancellingId,
    ]
  );

  const safeTotalPages = Math.max(
    1,
    totalPages || Math.ceil(total / pageSize) || 1
  );

  return (
    <ChronoViewWithTableLayout
      title="Mensualidades"
      description="Lista de suscripciones mensuales registradas en el sistema"
      filters={<StatusFilterComponent />}
      action={{
        label: "Crear mensualidad",
        icon: <Plus className="h-4 w-4" />,
        onClick: handleOpenCreateSubscription,
        permission: MensualidadesAction.CREAR_MENSUALIDAD,
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
