import { IPageProps } from "@/src/shared/interfaces/generic/page-props.interface";
import { listClosuresAction } from "../actions/list-closures.action";
import ClosureDataListComponent from "./closure-data-list.component";

interface Props {
  searchParams?: IPageProps["searchParams"];
}

export default async function ClosureDataFetchComponent({ searchParams }: Props) {

  const res = await listClosuresAction(searchParams);

  if (!res.success || !res.data) {
    console.error("Error details:", res.error);
    return <div>Error cargando cierres</div>;
  }

    const { data: {
        items, meta
    } } = res.data;

  return (
    <ClosureDataListComponent
      items={items}
      total={meta.total}
      totalPages={meta.totalPages}
      pageSize={meta.limit}
      currentPage={meta.page}
    />
  );
}
