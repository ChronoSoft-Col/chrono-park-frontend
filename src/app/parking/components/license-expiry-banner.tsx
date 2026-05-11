import { TriangleAlert } from "lucide-react";

type Props = {
  remainingDays: number;
};

export function LicenseExpiryBanner({ remainingDays }: Props) {
  const dayWord = remainingDays === 1 ? "día" : "días";
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 border-b border-amber-500/25 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-700 dark:text-amber-400"
    >
      <TriangleAlert className="h-4 w-4 shrink-0" />
      <span>
        Tu suscripción vence en {remainingDays} {dayWord}. Contacta a tu administrador para renovarla y evitar interrupciones.
      </span>
    </div>
  );
}
