import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import MasterKeysDataListComponent from "./master-keys-data-list.component";
import { resolveMetaData } from "@/lib/utils";
import listMasterKeysAction from "../actions/list-master-keys.action";
import { IMasterKeyEntity } from "@/server/domain";

interface Props {
  searchParams?: IPageProps["searchParams"];
}

export default async function MasterKeysDataFetchComponent({ searchParams }: Props) {
  const response = await listMasterKeysAction(searchParams);

  const listKey = JSON.stringify(searchParams ?? {});

  if (!response.success || !response.data || !response.data.success) {
    const errorMessage = response.error ?? "Error desconocido al cargar llaves maestras";
    return (
      <MasterKeysDataListComponent
        key={listKey}
        items={[]}
        total={0}
        totalPages={1}
        pageSize={10}
        error={errorMessage}
      />
    );
  }

  const { items, total, totalPages, pageSize } = resolveMetaData<IMasterKeyEntity>(response.data.data);

  return (
    <MasterKeysDataListComponent
      key={listKey}
      items={items}
      total={total}
      totalPages={totalPages}
      pageSize={pageSize}
    />
  );
}
