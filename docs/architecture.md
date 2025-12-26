# Arquitectura Cliente-Servidor

## 📁 Estructura

```
src/
├── client/                           # ⚡ Código del CLIENTE
│   ├── domain/
│   │   ├── entities/printer/        # Entidades de impresión
│   │   ├── repositories/printer/    # Interfaces de repositorios
│   │   ├── usecases/printer/        # Lógica de negocio del cliente
│   │   └── index.ts                 # Exports del dominio cliente
│   │
│   ├── infrastructure/
│   │   ├── datasources/printer/     # Comunicación HTTP (axios a localhost:8080)
│   │   ├── repositories/printer/    # Implementación de repositorios
│   │   └── index.ts                 # Exports de infraestructura cliente
│   │
│   └── di/
│       └── container.ts             # clientContainer (DI del cliente)
│
├── server/                           # 🔒 Código del SERVIDOR
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── auth/                # Entidades de autenticación
│   │   │   └── parking/             # Entidades de parqueadero
│   │   ├── repositories/
│   │   │   ├── auth/                # Interfaces de repos auth
│   │   │   └── parking/             # Interfaces de repos parking
│   │   ├── usecases/
│   │   │   ├── auth/                # Casos de uso auth
│   │   │   └── parking/             # Casos de uso parking
│   │   └── index.ts                 # Exports del dominio servidor
│   │
│   ├── infrastructure/
│   │   ├── datasources/
│   │   │   ├── auth/                # Datasources de auth
│   │   │   └── parking/             # Datasources de parking
│   │   ├── repositories/
│   │   │   ├── auth/                # Implementación repos auth
│   │   │   └── parking/             # Implementación repos parking
│   │   └── index.ts                 # Exports de infraestructura servidor
│   │
│   └── di/
│       └── container.ts             # serverContainer (DI del servidor)
│
├── shared/                           # 📦 Código COMPARTIDO
│   ├── hooks/
│   │   └── common/
│   │       ├── use-common.hook.ts   # Hook de datos comunes (servidor)
│   │       └── use-print.hook.ts    # Hook de impresión (cliente)
│   ├── components/                   # Componentes UI
│   ├── context/                      # React Context
│   └── ...
│
└── app/                              # 🎯 Next.js App Router
    ├── parking/
    │   ├── cobro/
    │   │   ├── actions/              # Server Actions
    │   │   └── components/           # Client Components
    │   ├── control-manual/
    │   └── ingresos-salidas/
    └── auth/
```

## 🎯 Reglas de Arquitectura

### Cliente (`client/`)
- **Directiva**: `'use client'` en todos los archivos
- **Uso**: Código que se ejecuta en el navegador
- **Casos de uso**:
  - Comunicación con servicios locales (localhost:8080)
  - Impresoras, dispositivos USB, etc.
  - Lógica que requiere acceso a APIs del navegador

### Servidor (`server/`)
- **Directiva**: `'use server'` en archivos que lo requieran
- **Uso**: Código que se ejecuta en el servidor Next.js
- **Casos de uso**:
  - Comunicación con APIs backend
  - Acceso a base de datos
  - Autenticación y autorización
  - Server Actions

## 📝 Imports

### En Server Actions
```typescript
import { serverContainer } from "@/server/di/container";
import { PaymentUsecase } from "@/server/domain";
import type { IGeneratePaymentParamsEntity } from "@/server/domain";
```

### En Client Components
```typescript
import { clientContainer } from "@/client/di/container";
import { PrintUsecase } from "@/client/domain";
import type { IPrintRequestEntity } from "@/client/domain";
```

### En Hooks del Cliente
```typescript
import { clientContainer } from "@/client/di/container";
import { PrintUsecase } from "@/client/domain/usecases/printer/print.usecase";
```

### En Hooks del Servidor
```typescript
import { serverContainer } from "@/server/di/container";
import { CommonUsecase } from "@/server/domain";
```

## ✅ Beneficios

1. **Separación clara**: Cliente y servidor completamente aislados
2. **Sin conflictos**: No más errores de "server-only" en cliente
3. **Type-safe**: TypeScript garantiza imports correctos
4. **Escalable**: Fácil agregar nuevos módulos a cada lado
5. **Mantenible**: Cada equipo puede trabajar independientemente

## 🔄 Migración Completa

✅ Módulo de impresión → `client/`
✅ Todo el resto → `server/`
✅ Containers separados
✅ Todos los imports actualizados
✅ Carpetas antiguas eliminadas
