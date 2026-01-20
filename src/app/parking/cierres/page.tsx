import { IPageProps } from "@/src/shared/interfaces/generic/page-props.interface";
import { SetupHeaderFilters } from "@/src/shared/components/layout/setup-header-filters.component";
import ClosureDataFetchComponent from "./components/closure-data-fetch.component";

export default async function ClosuresPage({
  searchParams,
}: {
  searchParams: Promise<IPageProps["searchParams"]>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="space-y-6">
      <SetupHeaderFilters showDatePicker={true} showSearch={false} />

      <ClosureDataFetchComponent searchParams={resolvedSearchParams} />
    </div>
  );
}
