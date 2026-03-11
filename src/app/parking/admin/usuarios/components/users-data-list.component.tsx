"use client";

import * as React from "react";

import type { IUserEntity } from "@/server/domain";
import { ChronoDataTable } from "@chrono/chrono-data-table.component";
import { ChronoPaginator } from "@chrono/chrono-paginator.component";
import { ChronoViewWithTableLayout } from "@chrono/chrono-view-with-table-layout.component";

import { UseDialogContext } from "@/src/shared/context/dialog.context";
import ChronoButton from "@/src/shared/components/chrono-soft/chrono-button.component";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

import { createUserColumns } from "./table/columns.component";
import { UserDetailDialogContent } from "./user-detail-dialog-content";
import { CreateUserDialogContent } from "./create-user-dialog.component";
import { EditUserDialogContent } from "./edit-user-dialog.component";
import { deleteUserAction } from "../actions/delete-user.action";
import listRolesAction from "../actions/list-roles.action";
import { UsuariosAction } from "@/src/shared/enums/auth/permissions.enum";

interface Props {
  items: IUserEntity[];
  total: number;
  totalPages: number;
  pageSize: number;
  error?: string;
}

export default function UsersDataListComponent({
  items,
  total,
  totalPages,
  pageSize,
  error,
}: Props) {
  const { openDialog, closeDialog, showYesNoDialog } = UseDialogContext();
  const errorShownRef = React.useRef(false);
  const [roles, setRoles] = React.useState<{ value: string; label: string }[]>([]);

  React.useEffect(() => {
    if (error && !errorShownRef.current) {
      errorShownRef.current = true;
      toast.error("Error al cargar datos", {
        description: error,
      });
    }
  }, [error]);

  // Fetch roles for selects
  React.useEffect(() => {
    const fetchRoles = async () => {
      const res = await listRolesAction({ limit: "100" });
      if (res.success && res.data?.success) {
        const roleItems = res.data.data.items ?? [];
        setRoles(roleItems.map((r) => ({ value: r.id, label: r.name })));
      }
    };
    fetchRoles();
  }, []);

  const handleDeleteYes = React.useCallback(
    async (item: IUserEntity) => {
      const toastId = toast.loading("Eliminando usuario...");
      try {
        const res = await deleteUserAction(item.id);
        if (!res.success) {
          toast.error(res.error || "No se pudo eliminar", { id: toastId });
          return;
        }

        toast.success("Usuario eliminado", { id: toastId });
        closeDialog();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Error inesperado al eliminar el usuario", { id: toastId });
      }
    },
    [closeDialog],
  );

  const handleEdit = React.useCallback(
    (item: IUserEntity) => {
      openDialog({
        title: `Editar ${item.firstName} ${item.lastName}`,
        description: "",
        content: <EditUserDialogContent user={item} roles={roles} />,
        dialogClassName: "w-full sm:max-w-3xl",
        contentClassName: "max-h-[75vh] overflow-y-auto pr-1",
      });
    },
    [openDialog, roles],
  );

  const handleOpenCreateUser = React.useCallback(() => {
    openDialog({
      title: "Crear usuario",
      description: "Registra un nuevo usuario en el sistema",
      content: <CreateUserDialogContent roles={roles} />,
      dialogClassName: "w-full sm:max-w-3xl",
      contentClassName: "max-h-[75vh] overflow-y-auto pr-1",
    });
  }, [openDialog, roles]);

  const handleViewDetail = React.useCallback(
    (item: IUserEntity) => {
      openDialog({
        title: `Detalle de ${item.firstName} ${item.lastName}`,
        description: "Información del usuario seleccionado",
        content: <UserDetailDialogContent item={item} />,
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
    (item: IUserEntity) => {
      showYesNoDialog({
        title: "Eliminar usuario",
        description: `¿Deseas eliminar a ${item.firstName} ${item.lastName}?`,
        requiresReloadOnYes: true,
        handleNo: closeDialog,
        handleYes: () => handleDeleteYes(item),
      });
    },
    [closeDialog, handleDeleteYes, showYesNoDialog],
  );

  const columns = React.useMemo(
    () => createUserColumns(handleViewDetail, handleEdit, handleDelete),
    [handleViewDetail, handleEdit, handleDelete],
  );

  const safeTotalPages = Math.max(
    1,
    totalPages || Math.ceil(total / pageSize) || 1,
  );

  return (
    <ChronoViewWithTableLayout
      title="Usuarios"
      description="Lista de usuarios registrados en el sistema"
      action={{
        label: "Crear usuario",
        icon: <Plus className="h-4 w-4" />,
        onClick: handleOpenCreateUser,
        permission: UsuariosAction.CREAR_USUARIOS,
      }}
      table={
        <ChronoDataTable
          data={items}
          columns={columns}
          caption={`${total} registros`}
          getRowKey={(row) => row.id}
          emptyMessage="Sin usuarios para mostrar"
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
