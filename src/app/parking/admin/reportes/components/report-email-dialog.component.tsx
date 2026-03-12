"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useReportStore } from "@/src/shared/stores/report.store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/ui/dialog";
import { Input } from "@/src/shared/components/ui/input";
import ChronoButton from "@chrono/chrono-button.component";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function ReportEmailDialogComponent() {
  const { responseType, requiresEmailData, sentByEmailData, isLoading, generateReport } =
    useReportStore();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const toastShownRef = useRef<string | null>(null);

  // Auto-open dialog when backend says requiresEmail
  useEffect(() => {
    if (responseType === "needsEmail") {
      setOpen(true);
    }
  }, [responseType]);

  // Show toast when sent by email
  useEffect(() => {
    if (responseType === "sent" && sentByEmailData) {
      const key = sentByEmailData.recipients.join(",");
      if (toastShownRef.current !== key) {
        toastShownRef.current = key;
        toast.success(`Reporte enviado a: ${sentByEmailData.recipients.join(", ")}`);
      }
    }
  }, [responseType, sentByEmailData]);

  const handleSend = useCallback(async () => {
    if (!email.trim()) return;

    const emails = email
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    await generateReport(emails);
    setOpen(false);
    setEmail("");
  }, [email, generateReport]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEmail("");
  }, []);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Enviar reporte por correo
          </DialogTitle>
          <DialogDescription>
            {requiresEmailData?.message ||
              "El reporte es muy grande para mostrarse en pantalla. Ingresa un correo electrónico para recibirlo."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium">Correo(s) electrónico(s)</label>
          <Input
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Puedes ingresar varios separados por coma.
          </p>
        </div>

        <DialogFooter>
          <ChronoButton variant="outline" onClick={handleClose}>
            Cancelar
          </ChronoButton>
          <ChronoButton onClick={handleSend} loading={isLoading} disabled={!email.trim()}>
            Enviar
          </ChronoButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
