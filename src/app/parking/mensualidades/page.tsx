import { SetupHeaderFilters } from "@/src/shared/components/layout/setup-header-filters.component";
import type { IPageProps } from "@/src/shared/interfaces/generic/page-props.interface";
import SubscriptionsDataFetchComponent from "./components/subscriptions-data-fetch.component";

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<IPageProps["searchParams"]>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="space-y-6">
      <SetupHeaderFilters showDatePicker={false} showSearch={true} />
      <SubscriptionsDataFetchComponent searchParams={resolvedSearchParams} />
    </div>
  );
}
