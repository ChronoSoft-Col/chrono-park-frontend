"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import type { IRoleEntity, IRoleDetailEntity } from "@/server/domain";
import { getRoleAction } from "../actions/get-role.action";
import { toast } from "sonner";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { formatActionName } from "./actions-tree/actions-tree.utils";

interface Props {
  role: IRoleEntity;
}

const formatDate = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
};

export function RoleDetailDialogContent({ role }: Props) {
  const [detail, setDetail] = React.useState<IRoleDetailEntity | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetch = async () => {
      const res = await getRoleAction(role.id);
      if (res.success && res.data?.success) {
        setDetail(res.data.data);
      } else {
        toast.error(res.error || "Error al cargar detalle del rol");
      }
      setLoading(false);
    };
    fetch();
  }, [role.id]);

  // Group actions by resource for display — must be before any early return
  const actionsByResource = React.useMemo(() => {
    if (!detail?.roleActions?.length) return [];

    const grouped = new Map<
      string,
      { resourceName: string; actions: string[] }
    >();

    for (const ra of detail.roleActions) {
      const action = ra.action;
      if (!action) continue;
      const resourceKey = action.resource?.id ?? "unknown";
      const resourceName = action.resource?.name ?? "Otro";

      if (!grouped.has(resourceKey)) {
        grouped.set(resourceKey, { resourceName, actions: [] });
      }
      grouped.get(resourceKey)!.actions.push(action.name);
    }

    return Array.from(grouped.values());
  }, [detail]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">
          Cargando detalle...
        </span>
      </div>
    );
  }

  const roleData = detail ?? role;

  return (
    <div className="space-y-5">
      {/* Basic info */}
      <div className="grid gap-3 sm:grid-cols-2">
        <DetailField label="Nombre" value={roleData.name} />
        <DetailField
          label="Descripción"
          value={roleData.description ?? "-"}
        />
        <DetailField
          label="Estado"
          value={roleData.isActive ? "Activo" : "Inactivo"}
        />
        <DetailField
          label="Fecha de creación"
          value={formatDate(roleData.createdAt)}
        />
      </div>

      {/* Actions / Permissions */}
      <div>
        <p className="text-sm font-medium mb-3">
          Permisos asignados
          {detail?.roleActions && (
            <span className="text-muted-foreground font-normal">
              {" "}
              ({detail.roleActions.length})
            </span>
          )}
        </p>

        {actionsByResource.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Este rol no tiene permisos asignados.
          </p>
        ) : (
          <div className="space-y-2">
            {actionsByResource.map((group) => (
              <div
                key={group.resourceName}
                className="rounded-lg border border-border bg-card/60 p-3"
              >
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                  {group.resourceName}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.actions.map((actionName) => (
                    <ChronoBadge
                      key={actionName}
                      variant="secondary"
                      tone="soft"
                    >
                      {formatActionName(actionName)}
                    </ChronoBadge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/80 p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
