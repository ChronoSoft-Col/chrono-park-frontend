import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import CustomersDataListComponent from "./customers-data-list.component";
import { resolveMetaData } from "@/lib/utils";
import listCustomersAction from "../actions/list-customers.action";
import { ICustomerEntity } from "@/server/domain";

interface Props {
  searchParams?: IPageProps["searchParams"];
}

export default async function CustomersDataFetchComponent({ searchParams }: Props) {
  const response = await listCustomersAction(searchParams);
  
  // Create a key based on searchParams to force re-mount when filters change
  const listKey = JSON.stringify(searchParams ?? {});
  
  if (!response.success || !response.data || !response.data.success) {
    const errorMessage = response.error ?? "Error desconocido al cargar clientes";
    return (
      <CustomersDataListComponent
        key={listKey}
        items={[]}
        total={0}
        totalPages={1}
        pageSize={10}
        error={errorMessage}
      />
    );
  }

  const { items, total, totalPages, pageSize } = resolveMetaData<ICustomerEntity>(response.data.data);

  return (
    <CustomersDataListComponent
      key={listKey}
      items={items}
      total={total}
      totalPages={totalPages}
      pageSize={pageSize}
    />
  );
}
