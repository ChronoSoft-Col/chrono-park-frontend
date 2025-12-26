"use client";

import { Label } from "@/src/shared/components/ui/label";
import { useState } from "react";
import { createClosureAction } from "../actions/create-closure.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePrint } from "@/src/shared/hooks/common/use-print.hook";
import { ClosureTypeEnum } from "@/src/shared/enums/parking/closure-type.enum";
import ChronoButton from "@chrono/chrono-button.component";
import { UseDialogContext } from "@/src/shared/context/dialog.context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";

export default function CreateClosureDialogContent() {
  const [type, setType] = useState<ClosureTypeEnum>(ClosureTypeEnum.PARCIAL);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { printClosureReceipt } = usePrint();
  const { closeDialog } = UseDialogContext();

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
        <Label htmlFor="type">Tipo de Cierre *</Label>
        <Select
          value={type}
          onValueChange={(value) => setType(value as ClosureTypeEnum)}
          disabled={isLoading}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Seleccione el tipo de cierre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ClosureTypeEnum.PARCIAL}>Cierre Parcial</SelectItem>
            <SelectItem value={ClosureTypeEnum.TOTAL}>Cierre Total</SelectItem>
          </SelectContent>
        </Select>
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
        <ChronoButton onClick={handleSubmit} loading={isLoading}>
          Crear e Imprimir
        </ChronoButton>
      </div>
    </div>
  );
}
