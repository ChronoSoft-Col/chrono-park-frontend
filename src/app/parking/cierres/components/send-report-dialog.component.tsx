"use client";

import { useState, useCallback, useRef, type KeyboardEvent } from "react";
import { ChronoInput } from "@chrono/chrono-input.component";
import ChronoButton from "@chrono/chrono-button.component";
import { Badge } from "@/src/shared/components/ui/badge";
import { Label } from "@/src/shared/components/ui/label";
import { X, Send } from "lucide-react";
import { toast } from "sonner";
import { sendClosureReportAction } from "../actions/send-closure-report.action";

const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.\w{2,}$/;

interface SendReportDialogProps {
  closureId: string;
  onClose: () => void;
}

export default function SendReportDialogContent({
  closureId,
  onClose,
}: SendReportDialogProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addEmail = useCallback(
    (raw: string) => {
      const email = raw.trim().toLowerCase();
      if (!email) return;

      if (!EMAIL_REGEX.test(email)) {
        setError(`"${email}" no es un correo válido`);
        return;
      }

      if (emails.includes(email)) {
        setError(`"${email}" ya fue agregado`);
        return;
      }

      setEmails((prev) => [...prev, email]);
      setInputValue("");
      setError("");
    },
    [emails]
  );

  const removeEmail = useCallback((email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === "," || e.key === " ") {
        e.preventDefault();
        addEmail(inputValue);
      }

      if (
        e.key === "Backspace" &&
        inputValue === "" &&
        emails.length > 0
      ) {
        setEmails((prev) => prev.slice(0, -1));
      }
    },
    [addEmail, inputValue, emails.length]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text");
      const parts = pasted.split(/[,;\s]+/).filter(Boolean);
      for (const part of parts) {
        addEmail(part);
      }
    },
    [addEmail]
  );

  const handleSend = useCallback(async () => {
    // Add current input if there's something typed
    if (inputValue.trim()) {
      const email = inputValue.trim().toLowerCase();
      if (!EMAIL_REGEX.test(email)) {
        setError(`"${email}" no es un correo válido`);
        return;
      }
      const allEmails = emails.includes(email)
        ? emails
        : [...emails, email];
      setEmails(allEmails);
      setInputValue("");

      if (allEmails.length === 0) {
        setError("Agregue al menos un correo electrónico");
        return;
      }

      setSending(true);
      const toastId = toast.loading("Enviando reporte por correo...");
      try {
        const res = await sendClosureReportAction(
          closureId,
          allEmails.join(", ")
        );
        if (!res.success) {
          toast.error(res.error || "No se pudo enviar el reporte", {
            id: toastId,
          });
          return;
        }
        toast.success(
          res.data?.message || "Reporte enviado correctamente",
          { id: toastId }
        );
        onClose();
      } catch {
        toast.error("Error inesperado al enviar el reporte", {
          id: toastId,
        });
      } finally {
        setSending(false);
      }
      return;
    }

    if (emails.length === 0) {
      setError("Agregue al menos un correo electrónico");
      return;
    }

    setSending(true);
    const toastId = toast.loading("Enviando reporte por correo...");
    try {
      const res = await sendClosureReportAction(
        closureId,
        emails.join(", ")
      );
      if (!res.success) {
        toast.error(res.error || "No se pudo enviar el reporte", {
          id: toastId,
        });
        return;
      }
      toast.success(
        res.data?.message || "Reporte enviado correctamente",
        { id: toastId }
      );
      onClose();
    } catch {
      toast.error("Error inesperado al enviar el reporte", {
        id: toastId,
      });
    } finally {
      setSending(false);
    }
  }, [closureId, emails, inputValue, onClose]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email-input">Correos electrónicos destinatarios</Label>
        <p className="text-muted-foreground text-sm">
          Escriba los correos y presione <kbd className="rounded border px-1 text-xs">Enter</kbd> o <kbd className="rounded border px-1 text-xs">,</kbd> para agregar cada uno.
        </p>

        {emails.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {emails.map((email) => (
              <Badge key={email} variant="secondary" className="gap-1 pr-1">
                {email}
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="hover:bg-muted-foreground/20 ml-0.5 rounded-full p-0.5"
                  aria-label={`Eliminar ${email}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <ChronoInput
          ref={inputRef}
          id="email-input"
          type="email"
          placeholder="correo@ejemplo.com"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => {
            if (inputValue.trim()) addEmail(inputValue);
          }}
          disabled={sending}
        />

        {error && (
          <p className="text-destructive text-sm">{error}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <ChronoButton variant="outline" onClick={onClose} disabled={sending}>
          Cancelar
        </ChronoButton>
        <ChronoButton
          onClick={handleSend}
          disabled={sending || (emails.length === 0 && !inputValue.trim())}
        >
          <Send className="mr-2 h-4 w-4" />
          Enviar reporte
        </ChronoButton>
      </div>
    </div>
  );
}
