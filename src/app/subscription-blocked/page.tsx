import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

import SubscriptionBlockedClient from "./components/subscription-blocked.client";

type PageProps = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function SubscriptionBlockedPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const { reason } = await searchParams;
  return <SubscriptionBlockedClient reason={reason || undefined} />;
}
