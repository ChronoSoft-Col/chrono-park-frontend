import type { IPageProps } from "@/src/shared/interfaces/generic/page-props.interface";
import { resolveMetaData } from "@/src/lib/utils";
import type { IPaymentItemEntity } from "@/src/server/domain/entities/parking/payment-list-item.entity";

import { listPaymentsAction } from "../actions/list-payments.action";
import PaymentsDataListComponent from "./payments-data-list.component";

interface Props {
  searchParams?: IPageProps["searchParams"];
}

export default async function PaymentsDataFetchComponent({ searchParams }: Props) {
  const res = await listPaymentsAction(searchParams);

  if (!res.success || !res.data || !res.data.success) {
    return <div>Error cargando pagos</div>;
  }

  const { items, total, totalPages, pageSize, page } = resolveMetaData<IPaymentItemEntity>(res.data.data);

  return (
    <PaymentsDataListComponent
      items={items}
      total={total}
      totalPages={totalPages}
      pageSize={pageSize}
      currentPage={page}
    />
  );
}
