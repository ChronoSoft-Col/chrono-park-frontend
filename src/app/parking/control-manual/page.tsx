import ManualIncomeFormComponent from "./components/manual-income-form.component";
import { SetupHeaderFilters } from "@/src/shared/components/layout/setup-header-filters.component";
import ChronoSplitPageLayout from "@chrono/chrono-split-page-layout.component";
import ManualExitPlaceholderComponent from "./components/manual-exit-placeholder.component";
import PermissionGuard from "@/src/shared/components/permission-guard.component";
import { ControlManualAction } from "@/src/shared/enums/auth/permissions.enum";

export default function ManualControlPage() {
  return (
    <PermissionGuard action={ControlManualAction.VER_INGRESO_MANUAL}>
      <div className="flex h-full w-full min-h-0">
        <SetupHeaderFilters showDatePicker={false} showSearch={false} />

        <ChronoSplitPageLayout
          title="Control manual"
          description="Registra ingresos o salidas manuales manteniendo consistencia con el módulo de cobro."
          left={<ManualIncomeFormComponent />}
          right={<ManualExitPlaceholderComponent />}
        />
      </div>
    </PermissionGuard>
  );
}
