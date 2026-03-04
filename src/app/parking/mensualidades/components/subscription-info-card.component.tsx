"use client";

import type { ISubscriptionEntity } from "@/server/domain";

type Props = {
  subscription: ISubscriptionEntity;
  className?: string;
};

export function SubscriptionInfoCard({ subscription, className }: Props) {
  return (
    <div className={className}>
      <div className="rounded-lg border bg-muted/30 p-4">
        <h4 className="mb-3 text-sm font-semibold">Información de la Suscripción</h4>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <div>
            <span className="text-muted-foreground">Cliente: </span>
            <span className="font-medium">
              {subscription.customer?.firstName} {subscription.customer?.lastName}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Plan: </span>
            <span className="font-medium">{subscription.monthlyPlan?.name}</span>
          </div>
          {subscription.vehicle ? (
            <div>
              <span className="text-muted-foreground">Vehículo: </span>
              <span className="font-medium">{subscription.vehicle.plateNumber}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
