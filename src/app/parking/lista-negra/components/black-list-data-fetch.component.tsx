import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import BlackListDataListComponent from "./black-list-data-list.component";
import { resolveMetaData } from "@/lib/utils";
import listBlackListAction from "../actions/list-black-list.action";
import { IBlackListEntity } from "@/server/domain";

interface Props {
  searchParams?: IPageProps["searchParams"];
}

export default async function BlackListDataFetchComponent({ searchParams }: Props) {
  const response = await listBlackListAction(searchParams);

  const listKey = JSON.stringify(searchParams ?? {});

  if (!response.success || !response.data || !response.data.success) {
    const errorMessage = response.error ?? "Error desconocido al cargar lista negra";
    return (
      <BlackListDataListComponent
        key={listKey}
        items={[]}
        total={0}
        totalPages={1}
        pageSize={10}
        error={errorMessage}
      />
    );
  }

  const { items, total, totalPages, pageSize } = resolveMetaData<IBlackListEntity>(response.data.data);

  return (
    <BlackListDataListComponent
      key={listKey}
      items={items}
      total={total}
      totalPages={totalPages}
      pageSize={pageSize}
    />
  );
}
