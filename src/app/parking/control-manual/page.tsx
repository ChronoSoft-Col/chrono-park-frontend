import ManualIncomeFormComponent from "./components/manual-income-form.component";
import { SetupHeaderFilters } from "@/src/shared/components/layout/setup-header-filters.component";
import ChronoSplitPageLayout from "@chrono/chrono-split-page-layout.component";
import ManualExitPlaceholderComponent from "./components/manual-exit-placeholder.component";

export default function ManualControlPage() {
  return (
    <div className="flex h-full w-full min-h-0">
      <SetupHeaderFilters showDatePicker={false} showSearch={false} />

      <ChronoSplitPageLayout
        title="Control manual"
        description="Registra ingresos o salidas manuales manteniendo consistencia con el módulo de cobro."
        left={<ManualIncomeFormComponent />}
        right={<ManualExitPlaceholderComponent />}
      />
    </div>
  );
}
