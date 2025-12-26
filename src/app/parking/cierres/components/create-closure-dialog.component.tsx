"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/shared/components/ui/dialog";
import { Button } from "@/src/shared/components/ui/button";
import { Label } from "@/src/shared/components/ui/label";
import { useState } from "react";
import { createClosureAction } from "../actions/create-closure.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePrint } from "@/src/shared/hooks/common/use-print.hook";
import { Loader2 } from "lucide-react";
import { ClosureTypeEnum } from "@/src/shared/enums/parking/closure-type.enum";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateClosureDialog({ isOpen, onClose }: Props) {
  const [type, setType] = useState<ClosureTypeEnum>(ClosureTypeEnum.PARCIAL);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { printClosureReceipt } = usePrint();

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
          await printClosureReceipt(result.data);
          toast.success("Cierre impreso correctamente");
        } catch (printError) {
          console.error("Error printing closure:", printError);
          toast.error("Cierre creado pero hubo un error al imprimir");
        }

        setType(ClosureTypeEnum.PARCIAL);
        onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Cierre de Caja</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Cierre *</Label>
            <Select value={type} onValueChange={(value) => setType(value as ClosureTypeEnum)} disabled={isLoading}>
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

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> Al crear el cierre se generará automáticamente un reporte con todas las operaciones del período y se enviará a imprimir.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crear e Imprimir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
