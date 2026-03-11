import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import UsersDataListComponent from "./users-data-list.component";
import { resolveMetaData } from "@/lib/utils";
import listUsersAction from "../actions/list-users.action";
import { IUserEntity } from "@/server/domain";

interface Props {
  searchParams?: IPageProps["searchParams"];
}

export default async function UsersDataFetchComponent({ searchParams }: Props) {
  const response = await listUsersAction(searchParams);

  const listKey = JSON.stringify(searchParams ?? {});

  if (!response.success || !response.data || !response.data.success) {
    const errorMessage = response.error ?? "Error desconocido al cargar usuarios";
    return (
      <UsersDataListComponent
        key={listKey}
        items={[]}
        total={0}
        totalPages={1}
        pageSize={10}
        error={errorMessage}
      />
    );
  }

  const { items, total, totalPages, pageSize } = resolveMetaData<IUserEntity>(response.data.data);

  return (
    <UsersDataListComponent
      key={listKey}
      items={items}
      total={total}
      totalPages={totalPages}
      pageSize={pageSize}
    />
  );
}
