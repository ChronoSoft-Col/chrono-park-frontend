import ManualIncomeFormComponent from "./components/manual-income-form.component";
import ManualExitPlaceholderComponent from "./components/manual-exit-placeholder.component";
import { SetupHeaderFilters } from "@/src/shared/components/layout/setup-header-filters.component";
import { ChronoViewLayout } from "@chrono/chrono-view-layout.component";
import PermissionGuard from "@/src/shared/components/permission-guard.component";
import { ControlManualAction } from "@/src/shared/enums/auth/permissions.enum";

export default function ManualControlPage() {
  return (
    <PermissionGuard action={ControlManualAction.VER_INGRESO_MANUAL}>
      <SetupHeaderFilters showDatePicker={false} showSearch={false} />
      <ChronoViewLayout
        title="Control manual"
        description="Registra ingresos o salidas manuales manteniendo consistencia con el módulo de cobro."
        showAsCard={false}
        contentClassName="grid gap-6 lg:grid-cols-2"
        className="h-full overflow-y-auto"
      >
        <ManualIncomeFormComponent />
        <ManualExitPlaceholderComponent />
      </ChronoViewLayout>
    </PermissionGuard>
  );
}
