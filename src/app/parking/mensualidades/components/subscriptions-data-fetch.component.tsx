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

  // Create a key based on searchParams to force re-mount when filters change
  const listKey = JSON.stringify(searchParams ?? {});

  if (!response.success || !response.data || !response.data.success) {
    const errorMessage = response.error ?? "Error desconocido al cargar mensualidades";
    return (
      <SubscriptionsDataListComponent
        key={listKey}
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
      key={listKey}
      items={items}
      total={total}
      totalPages={totalPages}
      pageSize={pageSize}
    />
  );
}
