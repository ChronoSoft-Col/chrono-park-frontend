# Componentes de diseño reutilizables

Este documento describe los componentes reutilizables creados para mantener consistencia en el diseño de la aplicación.

## ChronoSectionLabel

Componente para etiquetas de sección con estilo consistente.

**Ubicación:** `src/shared/components/chrono-soft/chrono-section-label.component.tsx`

**Uso:**
```tsx
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";

<ChronoSectionLabel size="xs">Total del cobro</ChronoSectionLabel>
<ChronoSectionLabel size="sm">Hora de salida</ChronoSectionLabel>
<ChronoSectionLabel size="md">Pasos</ChronoSectionLabel>
<ChronoSectionLabel size="base">Perfil de tarifa</ChronoSectionLabel>
```

**Props:**
- `size`: `"xs" | "sm" | "md" | "base"` - Tamaño del texto
  - `xs`: 9px
  - `sm`: 10px
  - `md`: 11px
  - `base`: text-xs (12px)
- `className`: string - Clases adicionales de Tailwind
- `children`: ReactNode - Contenido del label

**Características:**
- Font weight: semibold
- Text transform: uppercase
- Letter spacing: 0.3em
- Color: text-muted-foreground

---

## ChronoValue

Componente para mostrar valores importantes (números, texto destacado).

**Ubicación:** `src/shared/components/chrono-soft/chrono-value.component.tsx`

**Uso:**
```tsx
import { ChronoValue } from "@chrono/chrono-value.component";

<ChronoValue size="lg">{formatCurrency(totalAmount)}</ChronoValue>
<ChronoValue size="xl" weight="bold">{vehicle.licensePlate}</ChronoValue>
<ChronoValue size="md" muted>{changeValue}</ChronoValue>
```

**Props:**
- `size`: `"sm" | "md" | "lg" | "xl"` - Tamaño del texto
  - `sm`: text-base (16px)
  - `md`: text-lg (18px)
  - `lg`: text-xl (20px)
  - `xl`: text-2xl (24px)
- `weight`: `"medium" | "semibold" | "bold"` - Peso de la fuente (default: `"semibold"`)
- `muted`: boolean - Si es true, usa text-muted-foreground en lugar de text-foreground
- `className`: string - Clases adicionales de Tailwind
- `children`: ReactNode - Contenido del valor

**Características:**
- Letter spacing: tight
- Color: text-foreground (o text-muted-foreground si `muted=true`)

---

## Archivos actualizados

Los siguientes archivos fueron refactorizados para usar los nuevos componentes:

1. `src/app/parking/cobro/components/payment-section.component.tsx`
   - Labels de "Total del cobro" y "Cambio estimado"
   - Label de "Pasos"
   - Valores numéricos

2. `src/app/parking/cobro/components/parking-detail-section.component.tsx`
   - Label de "Perfil de tarifa"
   - Label de "Total estimado"
   - Valor del monto total

3. `src/app/parking/cobro/components/qr-section.component.tsx`
   - Labels de pasos "Hora de salida" y "QR o placa"

4. `src/app/parking/ingresos-salidas/components/overview-card.component.tsx`
   - Label de "Resumen"

5. `src/app/parking/ingresos-salidas/components/in-out-detail-dialog-content.tsx`
   - Label y valor de "Placa"

---

## Beneficios

✅ **Consistencia:** Todos los labels y valores tienen el mismo estilo en toda la aplicación  
✅ **Mantenibilidad:** Cambios de diseño se hacen en un solo lugar  
✅ **Legibilidad:** El código es más limpio y semántico  
✅ **Reutilización:** Evita duplicación de clases de Tailwind  
✅ **Tipado:** TypeScript garantiza el uso correcto de props
