import { SetupHeaderFilters } from "@/src/shared/components/layout/setup-header-filters.component";
import type { IPageProps } from "@/src/shared/interfaces/generic/page-props.interface";
import PaymentsDataFetchComponent from "./components/payments-data-fetch.component";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<IPageProps["searchParams"]>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="space-y-6">
      <SetupHeaderFilters showDatePicker={true} showSearch={true} />
      <PaymentsDataFetchComponent searchParams={resolvedSearchParams} />
    </div>
  );
}
