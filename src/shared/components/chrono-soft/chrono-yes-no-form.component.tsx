"use client";

import { useState, useCallback } from "react";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

import ChronoButton from "./chrono-button.component";

type ChronoYesNoFormProps = {
  yesText?: string;
  noText?: string;
  onYes?: () => void | Promise<void>;
  onNo?: () => void | Promise<void>;
  isLoading?: boolean;
  requiresReloadOnYes?: boolean;
};

export default function ChronoYesNoFormComponent({
  yesText = "Sí",
  noText = "No",
  onYes,
  onNo,
  requiresReloadOnYes = false,
  isLoading,
}: ChronoYesNoFormProps) {
  const [pending, setPending] = useState(false);
  const { refresh } = useRouter();

  const handleYes = useCallback(async () => {
    if (!onYes) return;
    const maybePromise = onYes();
    if (maybePromise && typeof (maybePromise as Promise<void>).then === "function") {
      try {
        setPending(true);
        await (maybePromise as Promise<void>);
      } finally {
        setPending(false);
        if (requiresReloadOnYes) {
          refresh();
        }
      }
    }
  }, [onYes, refresh, requiresReloadOnYes]);

  const handleNo = useCallback(async () => {
    if (!onNo) return;
    const maybePromise = onNo();
    if (maybePromise && typeof (maybePromise as Promise<void>).then === "function") {
      try {
        setPending(true);
        await (maybePromise as Promise<void>);
      } finally {
        setPending(false);
      }
    }
  }, [onNo]);

  return (
    <form>
      <div className="mt-6 flex items-center justify-between gap-4 px-4">
        <ChronoButton type="button" size="lg" onClick={handleYes} disabled={pending || Boolean(isLoading)} className="flex-1">
          <Check className="mr-2 size-4" />
          {yesText}
        </ChronoButton>
        <ChronoButton
          type="button"
          variant="outline"
          size="lg"
          onClick={handleNo}
          disabled={pending || Boolean(isLoading)}
          className="flex-1"
        >
          <X className="mr-2 size-4" />
          {noText}
        </ChronoButton>
      </div>
    </form>
  );
}
