import * as React from "react";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
} from "../ui/form";
import { cn } from "@/src/lib/utils";

export const ChronoForm = Form;
export const useChronoFormField = useFormField;
export const ChronoFormField = FormField;

export function ChronoFormItem({ className, ...props }: React.ComponentProps<typeof FormItem>) {
  return <FormItem className={cn("chrono-form__item", className)} {...props} />;
}

export function ChronoFormLabel({ className, ...props }: React.ComponentProps<typeof FormLabel>) {
  return <FormLabel className={cn("chrono-form__label tracking-[0.2em] uppercase", className)} {...props} />;
}

export function ChronoFormControl(props: React.ComponentProps<typeof FormControl>) {
  return <FormControl data-chrono-form-control="true" {...props} />;
}

export function ChronoFormDescription({ className, ...props }: React.ComponentProps<typeof FormDescription>) {
  return <FormDescription className={cn("chrono-form__description text-[11px]", className)} {...props} />;
}

export function ChronoFormMessage({ className, ...props }: React.ComponentProps<typeof FormMessage>) {
  return <FormMessage className={cn("chrono-form__message", className)} {...props} />;
}
