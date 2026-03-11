import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import RolesDataListComponent from "./roles-data-list.component";
import { resolveMetaData } from "@/lib/utils";
import listRolesAction from "../actions/list-roles.action";
import { IRoleEntity } from "@/server/domain";

interface Props {
  searchParams?: IPageProps["searchParams"];
}

export default async function RolesDataFetchComponent({ searchParams }: Props) {
  const response = await listRolesAction(searchParams);

  const listKey = JSON.stringify(searchParams ?? {});

  if (!response.success || !response.data || !response.data.success) {
    const errorMessage = response.error ?? "Error desconocido al cargar roles";
    return (
      <RolesDataListComponent
        key={listKey}
        items={[]}
        total={0}
        totalPages={1}
        pageSize={10}
        error={errorMessage}
      />
    );
  }

  const { items, total, totalPages, pageSize } = resolveMetaData<IRoleEntity>(response.data.data);

  return (
    <RolesDataListComponent
      key={listKey}
      items={items}
      total={total}
      totalPages={totalPages}
      pageSize={pageSize}
    />
  );
}
