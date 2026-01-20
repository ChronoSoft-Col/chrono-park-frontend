import { SetupHeaderFilters } from "@/src/shared/components/layout/setup-header-filters.component";
import { IPageProps } from "@/src/shared/interfaces/generic/page-props.interface";
import CustomersDataFetchComponent from "./components/customers-data-fetch.component";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<IPageProps["searchParams"]>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <div className="space-y-6">
      <SetupHeaderFilters showDatePicker={false} showSearch={true} />
      <CustomersDataFetchComponent searchParams={resolvedSearchParams} />
    </div>
  );
}
