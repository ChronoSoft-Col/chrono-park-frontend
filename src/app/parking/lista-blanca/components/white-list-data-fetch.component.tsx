import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import WhiteListDataListComponent from "./white-list-data-list.component";
import { resolveMetaData } from "@/lib/utils";
import listWhiteListAction from "../actions/list-white-list.action";
import { IWhiteListEntity } from "@/server/domain";

interface Props {
  searchParams?: IPageProps["searchParams"];
}

export default async function WhiteListDataFetchComponent({ searchParams }: Props) {
  const response = await listWhiteListAction(searchParams);

  const listKey = JSON.stringify(searchParams ?? {});

  if (!response.success || !response.data || !response.data.success) {
    const errorMessage = response.error ?? "Error desconocido al cargar lista blanca";
    return (
      <WhiteListDataListComponent
        key={listKey}
        items={[]}
        total={0}
        totalPages={1}
        pageSize={10}
        error={errorMessage}
      />
    );
  }

  const { items, total, totalPages, pageSize } = resolveMetaData<IWhiteListEntity>(response.data.data);

  return (
    <WhiteListDataListComponent
      key={listKey}
      items={items}
      total={total}
      totalPages={totalPages}
      pageSize={pageSize}
    />
  );
}
