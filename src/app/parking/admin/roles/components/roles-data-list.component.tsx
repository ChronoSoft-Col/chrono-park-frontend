"use client";

import * as React from "react";

import type { IRoleEntity, IActionGroupEntity } from "@/server/domain";
import { ChronoDataTable } from "@chrono/chrono-data-table.component";
import { ChronoPaginator } from "@chrono/chrono-paginator.component";
import { ChronoViewWithTableLayout } from "@chrono/chrono-view-with-table-layout.component";

import { UseDialogContext } from "@/src/shared/context/dialog.context";
import ChronoButton from "@/src/shared/components/chrono-soft/chrono-button.component";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

import { createRoleColumns } from "./table/columns.component";
import { RoleDetailDialogContent } from "./role-detail-dialog-content";
import { CreateRoleDialogContent } from "./create-role-dialog.component";
import { EditRoleDialogContent } from "./edit-role-dialog.component";
import { deleteRoleAction } from "../actions/delete-role.action";
import { getAllActionsAction } from "../actions/get-all-actions.action";
import { UsuariosAction } from "@/src/shared/enums/auth/permissions.enum";

interface Props {
  items: IRoleEntity[];
  total: number;
  totalPages: number;
  pageSize: number;
  error?: string;
}

export default function RolesDataListComponent({
  items,
  total,
  totalPages,
  pageSize,
  error,
}: Props) {
  const { openDialog, closeDialog, showYesNoDialog } = UseDialogContext();
  const errorShownRef = React.useRef(false);
  const [actionGroups, setActionGroups] = React.useState<IActionGroupEntity[]>([]);

  React.useEffect(() => {
    if (error && !errorShownRef.current) {
      errorShownRef.current = true;
      toast.error("Error al cargar datos", { description: error });
    }
  }, [error]);

  // Fetch all available actions for the tree
  React.useEffect(() => {
    const fetchActions = async () => {
      const res = await getAllActionsAction();
      if (res.success && res.data) {
        // res.data is the IGeneralResponse wrapper; the actual array is in .data
        const groups = Array.isArray(res.data) ? res.data : (res.data as unknown as { data: IActionGroupEntity[] }).data;
        if (Array.isArray(groups)) {
          setActionGroups(groups);
        }
      }
    };
    fetchActions();
  }, []);

  const handleDeleteYes = React.useCallback(
    async (item: IRoleEntity) => {
      const toastId = toast.loading("Eliminando rol...");
      try {
        const res = await deleteRoleAction(item.id);
        if (!res.success) {
          toast.error(res.error || "No se pudo eliminar", { id: toastId });
          return;
        }

        toast.success("Rol eliminado", { id: toastId });
        closeDialog();
      } catch (err) {
        console.error("Error deleting role:", err);
        toast.error("Error inesperado al eliminar el rol", { id: toastId });
      }
    },
    [closeDialog],
  );

  const handleEdit = React.useCallback(
    (item: IRoleEntity) => {
      openDialog({
        title: `Editar rol: ${item.name}`,
        description: "",
        content: <EditRoleDialogContent role={item} actionGroups={actionGroups} />,
        dialogClassName: "w-full sm:max-w-3xl",
        contentClassName: "max-h-[75vh] overflow-y-auto pr-1",
      });
    },
    [openDialog, actionGroups],
  );

  const handleOpenCreateRole = React.useCallback(() => {
    openDialog({
      title: "Crear rol",
      description: "Registra un nuevo rol en el sistema",
      content: <CreateRoleDialogContent actionGroups={actionGroups} />,
      dialogClassName: "w-full sm:max-w-3xl",
      contentClassName: "max-h-[75vh] overflow-y-auto pr-1",
    });
  }, [openDialog, actionGroups]);

  const handleViewDetail = React.useCallback(
    (item: IRoleEntity) => {
      openDialog({
        title: `Detalle del rol: ${item.name}`,
        description: "Información del rol seleccionado",
        content: <RoleDetailDialogContent role={item} />,
        dialogClassName: "w-full sm:max-w-3xl",
        contentClassName: "max-h-[75vh] overflow-y-auto pr-1",
        footer: (
          <ChronoButton
            onClick={closeDialog}
            variant="outline"
            iconPosition="left"
            icon={<X />}
            size="lg"
          >
            Cerrar
          </ChronoButton>
        ),
      });
    },
    [openDialog, closeDialog],
  );

  const handleDelete = React.useCallback(
    (item: IRoleEntity) => {
      showYesNoDialog({
        title: "Eliminar rol",
        description: `¿Deseas eliminar el rol "${item.name}"?`,
        requiresReloadOnYes: true,
        handleNo: closeDialog,
        handleYes: () => handleDeleteYes(item),
      });
    },
    [closeDialog, handleDeleteYes, showYesNoDialog],
  );

  const columns = React.useMemo(
    () => createRoleColumns(handleViewDetail, handleEdit, handleDelete),
    [handleViewDetail, handleEdit, handleDelete],
  );

  const safeTotalPages = Math.max(
    1,
    totalPages || Math.ceil(total / pageSize) || 1,
  );

  return (
    <ChronoViewWithTableLayout
      title="Roles"
      description="Lista de roles del sistema"
      action={{
        label: "Crear rol",
        icon: <Plus className="h-4 w-4" />,
        onClick: handleOpenCreateRole,
        permission: UsuariosAction.CREAR_USUARIOS,
      }}
      table={
        <ChronoDataTable
          data={items}
          columns={columns}
          caption={`${total} registros`}
          getRowKey={(row) => row.id}
          emptyMessage="Sin roles para mostrar"
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
