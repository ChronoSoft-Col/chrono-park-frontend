import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import { getInOutsAction } from "../actions/get-in-out.action";
import InOutDataListComponent from "./in-out-data-list.component";
import { resolveMetaData } from "@/lib/utils";
import { IInOutEntity } from "@/server/domain";

interface Props {
  searchParams?: IPageProps["searchParams"];
}

export default async function InOutDataFetchComponent({ searchParams }: Props) {
  const response = await getInOutsAction(searchParams);
  
  // Create a key based on searchParams to force re-mount when filters change
  const listKey = JSON.stringify(searchParams ?? {});
  
  if (!response.success || !response.data || !response.data.success) {
    const errorMessage = response.error ?? "Error desconocido al cargar ingresos/salidas";
    return (
      <InOutDataListComponent
        key={listKey}
        items={[]}
        total={0}
        totalPages={1}
        pageSize={10}
        error={errorMessage}
      />
    );
  }

  const { items, total, totalPages, pageSize } = resolveMetaData<IInOutEntity>(response.data.data);

  return (
    <InOutDataListComponent
      key={listKey}
      items={items}
      total={total}
      totalPages={totalPages}
      pageSize={pageSize}
    />
  );
}
