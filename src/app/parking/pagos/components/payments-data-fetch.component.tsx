import type { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import { resolveMetaData } from "@/lib/utils";

import { listPaymentsAction } from "../actions/list-payments.action";
import PaymentsDataListComponent from "./payments-data-list.component";
import { IPaymentItemEntity } from "@/server/domain";

interface Props {
  searchParams?: IPageProps["searchParams"];
}

export default async function PaymentsDataFetchComponent({ searchParams }: Props) {
  const res = await listPaymentsAction(searchParams);

  // Create a key based on searchParams to force re-mount when filters change
  const listKey = JSON.stringify(searchParams ?? {});

  if (!res.success || !res.data || !res.data.success) {
    const errorMessage = res.error ?? "Error desconocido al cargar pagos";
    return (
      <PaymentsDataListComponent
        key={listKey}
        items={[]}
        total={0}
        totalPages={1}
        pageSize={10}
        currentPage={1}
        error={errorMessage}
      />
    );
  }

  const { items, total, totalPages, pageSize, page } = resolveMetaData<IPaymentItemEntity>(res.data.data);

  return (
    <PaymentsDataListComponent
      key={listKey}
      items={items}
      total={total}
      totalPages={totalPages}
      pageSize={pageSize}
      currentPage={page}
    />
  );
}
