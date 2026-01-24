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
  console.log("listCustomersAction response:", response);
  if (!response.success || !response.data || !response.data.success) {
    return <div>Error cargando clientes</div>;
  }

  const { items, total, totalPages, pageSize } = resolveMetaData<ICustomerEntity>(response.data.data);

  return (
    <CustomersDataListComponent
      items={items}
      total={total}
      totalPages={totalPages}
      pageSize={pageSize}
    />
  );
}
