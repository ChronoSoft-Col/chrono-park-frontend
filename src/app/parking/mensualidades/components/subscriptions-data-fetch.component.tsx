import { IPageProps } from "@/shared/interfaces/generic/page-props.interface";
import SubscriptionsDataListComponent from "./subscriptions-data-list.component";
import { resolveMetaData } from "@/lib/utils";
import listSubscriptionsAction from "../actions/list-subscriptions.action";
import { ISubscriptionEntity } from "@/server/domain";

interface Props {
  searchParams?: IPageProps["searchParams"];
}

export default async function SubscriptionsDataFetchComponent({ searchParams }: Props) {
  const response = await listSubscriptionsAction(searchParams);

  if (!response.success || !response.data || !response.data.success) {
    const errorMessage = response.error ?? "Error desconocido al cargar mensualidades";
    return (
      <SubscriptionsDataListComponent
        items={[]}
        total={0}
        totalPages={1}
        pageSize={10}
        error={errorMessage}
      />
    );
  }

  const { items, total, totalPages, pageSize } = resolveMetaData<ISubscriptionEntity>(response.data.data);

  return (
    <SubscriptionsDataListComponent
      items={items}
      total={total}
      totalPages={totalPages}
      pageSize={pageSize}
    />
  );
}
