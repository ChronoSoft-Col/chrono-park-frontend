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
  console.log("Response from getInOutsAction:", response);
  if (!response.success || !response.data || !response.data.success) {
    return <div>Error cargando ingresos/salidas</div>;
  }

  const { items, total, totalPages, pageSize } = resolveMetaData<IInOutEntity>(response.data.data);

  return (
    <InOutDataListComponent
      items={items}
      total={total}
      totalPages={totalPages}
      pageSize={pageSize}
    />
  );
}
