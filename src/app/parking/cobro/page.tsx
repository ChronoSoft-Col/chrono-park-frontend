import { QrDetailSectionComponent } from "./components/parking-detail-section.component";
import { QrSectionComponent } from "./components/qr-section.component";
import { PaymentSectionComponent } from "./components/payment-section.component";

export default function Page() {
  return (
    <section className="grid h-full max-h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
      <div className="flex h-full min-h-0 min-w-0 flex-col justify-center gap-4">
        <QrSectionComponent className="h-min min-h-0 min-w-0" />

        <PaymentSectionComponent className="h-min min-h-0 min-w-0" />
      </div>

      <QrDetailSectionComponent className="min-h-0 min-w-0" />
    </section>
  );
}
