import { IPageProps } from "@/src/shared/interfaces/generic/page-props.interface";
import InOutDataFetchComponent from "./components/in-out-data-fetch.component";
import { SetupHeaderFilters } from "@/src/shared/components/layout/setup-header-filters.component";

export default async function InOutPage({
  searchParams,
}: {
  searchParams: Promise<IPageProps["searchParams"]>;
}) {
  const resolvedSearchParams = await searchParams;


  return (
    <div className="space-y-6">
      <SetupHeaderFilters showDateRangePicker={true} showSearch={true} />
      <InOutDataFetchComponent searchParams={resolvedSearchParams} />
    </div>
  );
}