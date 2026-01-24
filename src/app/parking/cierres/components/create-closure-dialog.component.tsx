"use client";

import { Label } from "@/src/shared/components/ui/label";
import { useState } from "react";
import { createClosureAction } from "../actions/create-closure.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePrint } from "@/src/shared/hooks/common/use-print.hook";
import { ClosureTypeEnum } from "@/src/shared/enums/parking/closure-type.enum";
import ChronoButton from "@chrono/chrono-button.component";
import {
  ChronoCard,
  ChronoCardDescription,
  ChronoCardHeader,
  ChronoCardTitle,
} from "@chrono/chrono-card.component";
import { UseDialogContext } from "@/src/shared/context/dialog.context";
import { cn } from "@/src/lib/utils";
import { CheckCircle2, Circle, Save } from "lucide-react";

export default function CreateClosureDialogContent() {
  const [type, setType] = useState<ClosureTypeEnum>(ClosureTypeEnum.PARCIAL);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { printClosureReceipt } = usePrint();
  const { closeDialog } = UseDialogContext();

  const options: Array<{
    value: ClosureTypeEnum;
    title: string;
    description: string;
    hint: string;
  }> = [
    {
      value: ClosureTypeEnum.PARCIAL,
      title: "Cierre Parcial",
      description: "Cierre de turno",
      hint: "Incluye solo las operaciones del período actual.",
    },
    {
      value: ClosureTypeEnum.TOTAL,
      title: "Cierre Total",
      description: "Cierre definitivo",
      hint: "Incluye todas las operaciones pendientes.",
    },
  ];

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const result = await createClosureAction({
        type,
      });

      if (result.success && result.data) {
        toast.success("Cierre creado exitosamente");
        
        // Imprimir el cierre
        try {
          const toastId = toast.loading("Enviando impresión...");
          const printResult = await printClosureReceipt(result.data);
          if (!printResult.success || !printResult.data) {
            toast.warning(
              "Cierre creado, pero no se pudo enviar la impresión. Intenta reimprimir más tarde.",
              { id: toastId },
            );
          } else {
            toast.success("Impresión enviada correctamente", { id: toastId });
          }
        } catch (printError) {
          console.error("Error printing closure:", printError);
          toast.warning(
            "Cierre creado, pero hubo un error al imprimir. Intenta reimprimir más tarde.",
          );
        }

        setType(ClosureTypeEnum.PARCIAL);
        closeDialog();
        router.refresh();
      } else {
        toast.error(result.error || "Error al crear el cierre");
      }
    } catch (error) {
      console.error("Error creating closure:", error);
      toast.error("Error inesperado al crear el cierre");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label id="closure-type-label">Tipo de Cierre *</Label>

        <div
          role="radiogroup"
          aria-labelledby="closure-type-label"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {options.map((opt) => {
            const selected = type === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                disabled={isLoading}
                onClick={() => setType(opt.value)}
                className={cn(
                  "block w-full text-left",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
                  isLoading && "cursor-not-allowed opacity-70",
                )}
                role="radio"
                aria-checked={selected}
              >
                <ChronoCard
                  className={cn(
                    "transition-colors",
                    "hover:border-foreground/20",
                    selected ? "border-primary ring-2 ring-primary/20" : "border-border",
                  )}
                >
                  <ChronoCardHeader className="space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <ChronoCardTitle className="text-base">
                          {opt.title}
                        </ChronoCardTitle>
                        <ChronoCardDescription className="text-sm">
                          {opt.description}
                        </ChronoCardDescription>
                      </div>
                      {selected ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{opt.hint}</p>
                  </ChronoCardHeader>
                </ChronoCard>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {type === ClosureTypeEnum.PARCIAL
            ? "Cierre de turno: incluye solo las operaciones del período actual"
            : "Cierre definitivo: incluye todas las operaciones pendientes"}
        </p>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800">
          <strong>Nota:</strong> Al crear el cierre se generará automáticamente un reporte con todas las
          operaciones del período y se enviará a imprimir.
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <ChronoButton variant="outline" onClick={closeDialog} disabled={isLoading}>
          Cancelar
        </ChronoButton>
        <ChronoButton onClick={handleSubmit} loading={isLoading} icon={<Save/>}>
          Crear e Imprimir
        </ChronoButton>
      </div>
    </div>
  );
}
