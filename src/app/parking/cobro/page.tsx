import { QrDetailSectionComponent } from "./components/parking-detail-section.component";
import { QrSectionComponent } from "./components/qr-section.component";
import { PaymentSectionComponent } from "./components/payment-section.component";
import { ServicesCartDrawerComponent } from "./components/services-cart-drawer.component";
import { SetupHeaderFilters } from "@/src/shared/components/layout/setup-header-filters.component";

export default function Page() {
  return (
    <section className="relative h-full max-h-full min-h-0">
      <SetupHeaderFilters showDatePicker={false} showDateRangePicker={false} showSearch={false} />
      <div className="absolute right-0 top-0 z-10">
        <ServicesCartDrawerComponent />
      </div>
      
      <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <div className="flex h-full min-h-0 min-w-0 flex-col justify-center gap-4">
          <QrSectionComponent className="h-min min-h-0 min-w-0" />
          <PaymentSectionComponent className="h-min min-h-0 min-w-0" />
        </div>

        <QrDetailSectionComponent className="min-h-0 min-w-0" />
      </div>
    </section>
  );
}
