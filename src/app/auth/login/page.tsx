"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";

import { loginAction } from "@/src/app/auth/actions/login.action";
import { ILoginParams } from "@/server/domain/index";
import { signOut } from "@/src/lib/session-client";
import { useAuthStore } from "@/src/shared/stores/auth.store";
import ChronoButton from "@chrono/chrono-button.component";
import {
  ChronoCard,
  ChronoCardHeader,
  ChronoCardTitle,
  ChronoCardDescription,
  ChronoCardAction,
  ChronoCardContent,
  ChronoCardFooter,
} from "@chrono/chrono-card.component";
import {
  ChronoForm,
  ChronoFormControl,
  ChronoFormField,
  ChronoFormItem,
  ChronoFormLabel,
  ChronoFormMessage,
} from "@chrono/chrono-form.component";
import { ChronoInput } from "@chrono/chrono-input.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";
import { LoginSchema } from "@/src/shared/schemas/auth/login.schema";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Si llegamos al login con una cookie vencida/invalidada, la limpiamos desde el cliente.
    // (En Server Components no se puede modificar cookies directamente)
    signOut().catch(() => null);
  }, []);

  const form = useForm<ILoginParams>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const [isShownPassword, setIsShownPassword] = useState(false);
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit: SubmitHandler<ILoginParams> = async (data) => {
    const loadingToast = toast.loading("Iniciando sesión...");

    try {
      const response = await loginAction({
        identifier: data.identifier,
        password: data.password,
      });

      if (!response.success || !response.data) {
        toast.error(response.error ?? "No se pudo iniciar sesión", {
          id: loadingToast,
        });
        return;
      }

      // Guardar applications y permissions en Zustand
      const store = useAuthStore.getState();
      store.setApplications(response.data.applications ?? []);
      store.setActions(response.data.permissions ?? []);

      // Redirect fijo post-login
      toast.success("Sesión iniciada correctamente", { id: loadingToast });
      router.replace("/parking");
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo iniciar sesión"), {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="flex w-full max-w-lg flex-1 items-center justify-center px-2 py-4 sm:px-4">
      <ChronoCard className="w-full">
        <ChronoCardHeader>
          <ChronoCardTitle className="text-2xl font-semibold">Inicia sesión en CHRONOPARK</ChronoCardTitle>
          <ChronoCardDescription>
            Ingresa tus credenciales para acceder al panel de administración.
          </ChronoCardDescription>
          <ChronoCardAction>
            <ChronoButton
              type="button"
              variant="link"
              onClick={() =>
                toast.info("Contacta al administrador de ChronoPark para crear o recuperar tu acceso.")
              }
            >
              ¿Necesitas ayuda?
            </ChronoButton>
          </ChronoCardAction>
        </ChronoCardHeader>
  <ChronoCardContent>
          <ChronoForm {...form}>
            <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
              <ChronoFormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <ChronoFormItem>
                    <ChronoFormLabel>Correo electrónico o cédula</ChronoFormLabel>
                    <ChronoFormControl>
                      <ChronoInput
                        {...field}
                        autoComplete="username"
                        placeholder="nombre@empresa.com o cédula"
                        type="text"
                      />
                    </ChronoFormControl>
                    <ChronoFormMessage />
                  </ChronoFormItem>
                )}
              />
              <ChronoFormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <ChronoFormItem>
                    <ChronoFormLabel>Contraseña</ChronoFormLabel>
                    <ChronoFormControl>
                      <div className="relative">
                        <ChronoInput
                          {...field}
                          autoComplete="current-password"
                          placeholder="Ingresa tu contraseña"
                          type={isShownPassword ? "text" : "password"}
                          className="pr-12"
                        />
                        <ChronoButton
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setIsShownPassword((prev) => !prev)}
                          aria-label={isShownPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          aria-pressed={isShownPassword}
                        >
                          {isShownPassword ? <EyeOff className="size-4" /> : <EyeIcon className="size-4" />}
                        </ChronoButton>
                      </div>
                    </ChronoFormControl>
                    <ChronoFormMessage />
                  </ChronoFormItem>
                )}
              />

              <ChronoButton type="submit" icon={<LogIn />} size="lg" className="w-full" disabled={isSubmitting} loading={isSubmitting}>
                Iniciar sesión
              </ChronoButton>
            </form>
          </ChronoForm>
        </ChronoCardContent>
        <ChronoCardFooter className="flex-col items-center text-center">
          <ChronoSeparator className="w-full bg-border/60" />
          <p className="text-sm text-muted-foreground">
            ¿No tienes acceso? Comunícate con tu administrador para solicitar una cuenta.
          </p>
          <ChronoButton variant="link" asChild>
            <Link href="mailto:info@chronosoft.com.co">Escríbenos a info@chronosoft.com.co</Link>
          </ChronoButton>
        </ChronoCardFooter>
      </ChronoCard>
    </div>
  );
}
