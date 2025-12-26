import { IPageProps } from "@/src/shared/interfaces/generic/page-props.interface";
import { getInOutsAction } from "../actions/get-in-out.action";
import { DEFAULT_LIMIT } from "@/src/shared/constants/pagination";
import InOutDataListComponent from "./in-out-data-list.component";

interface Props {
  searchParams?: IPageProps["searchParams"];
}

export default async function InOutDataFetchComponent({ searchParams }: Props) {
  const response = await getInOutsAction(searchParams);

  if (!response.success || !response.data || !response.data.success) {
    return <div>Error cargando ingresos/salidas</div>;
  }

  const {
    data: { items, meta },
  } = response.data;

  const total = meta?.total ?? items.length;
  const totalPages = meta?.totalPages ?? 1;
  const pageSize = meta?.limit ?? DEFAULT_LIMIT;

  return (
    <InOutDataListComponent
      items={items}
      total={total}
      totalPages={totalPages}
      pageSize={pageSize}
    />
  );
}
