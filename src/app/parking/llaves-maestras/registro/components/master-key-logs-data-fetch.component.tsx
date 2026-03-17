import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import MasterKeyLogsDataListComponent from "./master-key-logs-data-list.component";
import { resolveMetaData } from "@/lib/utils";
import listMasterKeyLogsAction from "../actions/list-master-key-logs.action";
import { IMasterKeyLogEntity } from "@/server/domain";

interface Props {
  searchParams?: IPageProps["searchParams"];
}

export default async function MasterKeyLogsDataFetchComponent({ searchParams }: Props) {
  const response = await listMasterKeyLogsAction(searchParams);

  const listKey = JSON.stringify(searchParams ?? {});

  if (!response.success || !response.data || !response.data.success) {
    const errorMessage = response.error ?? "Error desconocido al cargar registros de llaves maestras";
    return (
      <MasterKeyLogsDataListComponent
        key={listKey}
        items={[]}
        total={0}
        totalPages={1}
        pageSize={10}
        error={errorMessage}
      />
    );
  }

  const { items, total, totalPages, pageSize } = resolveMetaData<IMasterKeyLogEntity>(response.data.data);

  return (
    <MasterKeyLogsDataListComponent
      key={listKey}
      items={items}
      total={total}
      totalPages={totalPages}
      pageSize={pageSize}
    />
  );
}
