import { SetupHeaderFilters } from "@/src/shared/components/layout/setup-header-filters.component";
import { IPageProps } from "@/src/shared/interfaces/generic/page-props.interface";
import UsersDataFetchComponent from "./components/users-data-fetch.component";

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<IPageProps["searchParams"]>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <div className="space-y-6">
      <SetupHeaderFilters showDatePicker={false} showSearch={true} />
      <UsersDataFetchComponent searchParams={resolvedSearchParams} />
    </div>
  );
}
