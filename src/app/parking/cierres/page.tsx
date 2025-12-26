import { IPageProps } from "@/src/shared/interfaces/generic/page-props.interface";
import { SetupHeaderFilters } from "@/src/shared/components/layout/setup-header-filters.component";
import ClosureDataFetchComponent from "./components/closure-data-fetch.component";
import CreateClosureButton from "./components/create-closure-button.component";

export default async function ClosuresPage({
  searchParams,
}: {
  searchParams: Promise<IPageProps["searchParams"]>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cierres de Caja</h1>
        <CreateClosureButton />
      </div>
      
      <SetupHeaderFilters showDatePicker={true} showSearch={false} />
      
      <ClosureDataFetchComponent searchParams={resolvedSearchParams} />
    </div>
  );
}
