"use client";

import { useState, useCallback, useEffect, useMemo, useRef, type KeyboardEvent } from "react";
import { ChronoInput } from "@chrono/chrono-input.component";
import ChronoButton from "@chrono/chrono-button.component";
import { Badge } from "@/src/shared/components/ui/badge";
import { Label } from "@/src/shared/components/ui/label";
import { Checkbox } from "@/src/shared/components/ui/checkbox";
import { Plus, X, Send } from "lucide-react";
import { toast } from "sonner";
import { sendClosureReportAction } from "../actions/send-closure-report.action";
import { getCommonAction } from "@/src/app/global-actions/get-common.action";
import { EServices } from "@/src/shared/enums/common/services.enum";
import type { TClosureEmailRecipient } from "@/src/shared/types/common/closure-email-recipient.type";

const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.\w{2,}$/;

interface SendReportDialogProps {
  closureId: string;
  onClose: () => void;
}


export default function SendReportDialogContent({
  closureId,
  onClose,
}: SendReportDialogProps) {
  const [configuredRecipients, setConfiguredRecipients] =
    useState<TClosureEmailRecipient[]>([]);
  const [selectedConfiguredIds, setSelectedConfiguredIds] = useState<Set<string>>(
    () => new Set()
  );
  const [loadingConfigured, setLoadingConfigured] = useState(true);

  const [emails, setEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;

    const loadRecipients = async () => {
      setLoadingConfigured(true);
      try {
        const res = await getCommonAction<TClosureEmailRecipient[]>(
          EServices.CLOSURE_EMAIL_RECIPIENTS
        );

        if (!isMounted) return;

        if (!res.success || !res.data?.success) {
          toast.error("No se pudieron cargar los correos configurados", {
            description: res.error || res.data?.message,
          });
          setConfiguredRecipients([]);
          setSelectedConfiguredIds(new Set());
          return;
        }

        const recipients = Array.isArray(res.data.data) ? res.data.data : [];
        setConfiguredRecipients(recipients);
        setSelectedConfiguredIds(new Set(recipients.map((r) => r.value)));
      } catch (e) {
        if (!isMounted) return;
        console.error("Error loading closure email recipients:", e);
        toast.error("Error inesperado al cargar los correos configurados");
        setConfiguredRecipients([]);
        setSelectedConfiguredIds(new Set());
      } finally {
        if (!isMounted) return;
        setLoadingConfigured(false);
      }
    };

    loadRecipients();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const configuredEmails = useMemo(() => {
    if (configuredRecipients.length === 0) return [];
    const selected = selectedConfiguredIds;
    return configuredRecipients
      .filter((r) => selected.has(r.value))
      .map((r) => r.label.trim().toLowerCase())
      .filter(Boolean);
  }, [configuredRecipients, selectedConfiguredIds]);

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
    const selected = [...configuredEmails];
    const custom = [...emails];

    let typed: string | undefined;
    if (inputValue.trim()) {
      typed = inputValue.trim().toLowerCase();
      if (!EMAIL_REGEX.test(typed)) {
        setError(`"${typed}" no es un correo válido`);
        return;
      }
    }

    const combined = [
      ...selected,
      ...custom,
      ...(typed ? [typed] : []),
    ]
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const uniqueEmails = Array.from(new Set(combined));

    if (uniqueEmails.length === 0) {
      setError("Seleccione al menos un correo o agregue uno personalizado");
      return;
    }

    if (typed) {
      setEmails((prev) => (prev.includes(typed!) ? prev : [...prev, typed!]));
      setInputValue("");
    }

    setSending(true);
    const toastId = toast.loading("Enviando reporte por correo...");
    try {
      const res = await sendClosureReportAction(
        closureId,
        uniqueEmails.join(", ")
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
  }, [closureId, configuredEmails, emails, inputValue, onClose]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Correos configurados</Label>
        {loadingConfigured ? (
          <p className="text-muted-foreground text-sm">Cargando...</p>
        ) : configuredRecipients.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No hay correos configurados para cierre.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {configuredRecipients.map((r) => {
              const id = `configured-${r.value}`;
              const checked = selectedConfiguredIds.has(r.value);
              return (
                <div key={r.value} className="flex items-start gap-2">
                  <Checkbox
                    id={id}
                    checked={checked}
                    disabled={sending}
                    onCheckedChange={(value) => {
                      const nextChecked = value === true;
                      setSelectedConfiguredIds((prev) => {
                        const next = new Set(prev);
                        if (nextChecked) next.add(r.value);
                        else next.delete(r.value);
                        return next;
                      });
                      setError("");
                    }}
                  />
                  <Label htmlFor={id} className="cursor-pointer leading-5">
                    {r.label}
                    {r.name ? (
                      <span className="text-muted-foreground"> · {r.name}</span>
                    ) : null}
                  </Label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email-input">Correos personalizados</Label>
        <p className="text-muted-foreground text-sm">
          Escriba el correo y presione <kbd className="rounded border px-1 text-xs">Enter</kbd> o use <kbd className="rounded border px-1 text-xs">+</kbd> para agregar.
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

        <div className="flex gap-2">
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
            className="flex-1"
          />
          <ChronoButton
            type="button"
            onClick={() => {
              if (inputValue.trim()) addEmail(inputValue);
              else inputRef.current?.focus();
            }}
            disabled={sending}
            aria-label="Agregar correo personalizado"
            className="my-auto h-6"
            size={"icon-lg"}
          >
            <Plus />
          </ChronoButton>
        </div>

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
          disabled={
            sending ||
            (selectedConfiguredIds.size === 0 &&
              emails.length === 0 &&
              !inputValue.trim())
          }
        >
          <Send className="mr-2 h-4 w-4" />
          Enviar reporte
        </ChronoButton>
      </div>
    </div>
  );
}
