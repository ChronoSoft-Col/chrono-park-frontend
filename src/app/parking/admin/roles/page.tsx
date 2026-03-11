import { SetupHeaderFilters } from "@/src/shared/components/layout/setup-header-filters.component";
import { IPageProps } from "@/src/shared/interfaces/generic/page-props.interface";
import RolesDataFetchComponent from "./components/roles-data-fetch.component";

export default async function RolesPage({
  searchParams,
}: {
  searchParams: Promise<IPageProps["searchParams"]>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <div className="space-y-6">
      <SetupHeaderFilters showDatePicker={false} showSearch={true} />
      <RolesDataFetchComponent searchParams={resolvedSearchParams} />
    </div>
  );
}
