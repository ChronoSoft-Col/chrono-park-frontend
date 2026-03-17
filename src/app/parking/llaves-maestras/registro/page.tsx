import { SetupHeaderFilters } from "@/src/shared/components/layout/setup-header-filters.component";
import { IPageProps } from "@/src/shared/interfaces/generic/page-props.interface";
import MasterKeyLogsDataFetchComponent from "./components/master-key-logs-data-fetch.component";

export default async function MasterKeyLogsPage({
  searchParams,
}: {
  searchParams: Promise<IPageProps["searchParams"]>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <div className="space-y-6">
      <SetupHeaderFilters showDatePicker={true} showSearch={false} />
      <MasterKeyLogsDataFetchComponent searchParams={resolvedSearchParams} />
    </div>
  );
}
