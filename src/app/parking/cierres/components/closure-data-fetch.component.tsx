import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import { listClosuresAction } from "../actions/list-closures.action";
import ClosureDataListComponent from "./closure-data-list.component";
import { resolveMetaData } from "@/lib/utils";
import { IClosureListItemEntity } from "@/server/domain/entities/parking/closures/closure-list-item.entity";

interface Props {
  searchParams?: IPageProps["searchParams"];
}

export default async function ClosureDataFetchComponent({ searchParams }: Props) {
  const res = await listClosuresAction(searchParams);

  if (!res.success || !res.data) {
    const errorMessage = res.error ?? "Error desconocido al cargar cierres";
    return (
      <ClosureDataListComponent
        items={[]}
        total={0}
        totalPages={1}
        pageSize={10}
        currentPage={1}
        error={errorMessage}
      />
    );
  }
  
  const { items, total, totalPages, pageSize, page } = resolveMetaData<IClosureListItemEntity>(res.data.data);

  return (
    <ClosureDataListComponent
      items={items}
      total={total}
      totalPages={totalPages}
      pageSize={pageSize}
      currentPage={page}
    />
  );
}
