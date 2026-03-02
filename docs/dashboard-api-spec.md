# Especificación API Dashboard - ChronoPark

**Fecha:** Marzo 2026  
**Versión:** 1.0  
**Autor:** Frontend Team

---

## Descripción General

Este documento describe los endpoints requeridos por el frontend para implementar el módulo de Dashboard del sistema de estacionamiento. Cada endpoint incluye la estructura de respuesta esperada y los parámetros de filtrado.

---

## ⚠️ Estructura de Respuesta (GeneralResponse)

**IMPORTANTE:** Todas las respuestas de los endpoints deben venir envueltas en el objeto `GeneralResponse` estándar del backend:

```typescript
interface GeneralResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
```

### Ejemplo de respuesta real

Cuando se documenta que un endpoint devuelve:

```json
{
  "occupancy": { "total": 150, "occupied": 87 }
}
```

La respuesta **real** del backend debe ser:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Dashboard overview retrieved successfully",
  "data": {
    "occupancy": { "total": 150, "occupied": 87 }
  }
}
```

### Respuesta de error

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid date range: startDate must be before endDate",
  "data": null
}
```

> **Nota:** En este documento, las estructuras JSON mostradas en cada endpoint representan únicamente el contenido del campo `data`. El wrapper `GeneralResponse` se omite por brevedad.

---

## Parámetros Comunes

Todos los endpoints que soportan filtrado por fechas utilizan los siguientes parámetros:

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `startDate` | `string` (ISO 8601) | Fecha de inicio del rango (ej: `2026-02-01`) |
| `endDate` | `string` (ISO 8601) | Fecha de fin del rango (ej: `2026-02-28`) |
| `groupBy` | `'hour' \| 'day' \| 'week' \| 'month'` | Agrupación temporal para datos históricos |
| `zone` | `string` (opcional) | Filtrar por zona del estacionamiento |
| `vehicleType` | `string` (opcional) | Filtrar por tipo de vehículo |

---

## Endpoints

### 1. Resumen General (KPIs principales)

**Endpoint:** `GET /dashboard/overview`

**Descripción:** Proporciona los datos principales para las tarjetas de resumen del dashboard (ocupación actual, estadísticas del día, comparativas).

**Parámetros:** Ninguno (datos en tiempo real)

**Respuesta:**

```json
{
  "occupancy": {
    "total": 150,
    "occupied": 87,
    "available": 63,
    "percentage": 58.0
  },
  "todayStats": {
    "entries": 234,
    "exits": 198,
    "activeVehicles": 36,
    "revenue": 125000.00
  },
  "comparison": {
    "entriesChange": 12.5,
    "revenueChange": -3.2
  }
}
```

**Campos:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `occupancy.total` | `number` | Total de espacios en el estacionamiento |
| `occupancy.occupied` | `number` | Espacios actualmente ocupados |
| `occupancy.available` | `number` | Espacios disponibles |
| `occupancy.percentage` | `number` | Porcentaje de ocupación (0-100) |
| `todayStats.entries` | `number` | Entradas del día actual |
| `todayStats.exits` | `number` | Salidas del día actual |
| `todayStats.activeVehicles` | `number` | Vehículos actualmente en el estacionamiento |
| `todayStats.revenue` | `number` | Ingresos acumulados del día |
| `comparison.entriesChange` | `number` | % de cambio en entradas vs ayer |
| `comparison.revenueChange` | `number` | % de cambio en ingresos vs ayer |

---

### 2. Tráfico de Entradas y Salidas

**Endpoint:** `GET /dashboard/traffic`

**Descripción:** Datos históricos de entradas y salidas para gráficos de líneas o barras.

**Parámetros:**

| Parámetro | Requerido | Descripción |
|-----------|-----------|-------------|
| `startDate` | Sí | Fecha inicio |
| `endDate` | Sí | Fecha fin |
| `groupBy` | Sí | `hour`, `day`, `week` o `month` |

**Ejemplo:** `GET /dashboard/traffic?startDate=2026-02-01&endDate=2026-02-28&groupBy=day`

**Respuesta:**

```json
{
  "period": {
    "start": "2026-02-01",
    "end": "2026-02-28"
  },
  "groupBy": "day",
  "data": [
    {
      "date": "2026-02-01",
      "entries": 145,
      "exits": 140
    },
    {
      "date": "2026-02-02",
      "entries": 98,
      "exits": 102
    }
  ],
  "totals": {
    "entries": 4320,
    "exits": 4285
  }
}
```

---

### 3. Transacciones

**Endpoint:** `GET /dashboard/transactions`

**Descripción:** Cantidad de transacciones e ingresos agrupados por período.

**Parámetros:**

| Parámetro | Requerido | Descripción |
|-----------|-----------|-------------|
| `startDate` | Sí | Fecha inicio |
| `endDate` | Sí | Fecha fin |
| `groupBy` | Sí | `hour`, `day`, `week` o `month` |

**Ejemplo:** `GET /dashboard/transactions?startDate=2026-02-01&endDate=2026-02-28&groupBy=day`

**Respuesta:**

```json
{
  "period": {
    "start": "2026-02-01",
    "end": "2026-02-28"
  },
  "data": [
    {
      "date": "2026-02-01",
      "count": 140,
      "revenue": 85000.00
    },
    {
      "date": "2026-02-02",
      "count": 102,
      "revenue": 62000.00
    }
  ],
  "totals": {
    "count": 4285,
    "revenue": 2500000.00
  },
  "averageTicket": 583.43
}
```

---

### 4. Ingresos por Tipo de Vehículo

**Endpoint:** `GET /dashboard/revenue-by-vehicle`

**Descripción:** Desglose de ingresos y cantidad de vehículos por tipo. Ideal para gráficos de pastel/donut.

**Parámetros:**

| Parámetro | Requerido | Descripción |
|-----------|-----------|-------------|
| `startDate` | Sí | Fecha inicio |
| `endDate` | Sí | Fecha fin |

**Ejemplo:** `GET /dashboard/revenue-by-vehicle?startDate=2026-02-01&endDate=2026-02-28`

**Respuesta:**

```json
{
  "data": [
    {
      "vehicleType": "AUTO",
      "count": 3200,
      "revenue": 1600000.00,
      "percentage": 64.0
    },
    {
      "vehicleType": "MOTO",
      "count": 800,
      "revenue": 320000.00,
      "percentage": 12.8
    },
    {
      "vehicleType": "CAMIONETA",
      "count": 285,
      "revenue": 580000.00,
      "percentage": 23.2
    }
  ],
  "totals": {
    "count": 4285,
    "revenue": 2500000.00
  }
}
```

---

### 5. Horas Pico

**Endpoint:** `GET /dashboard/peak-hours`

**Descripción:** Análisis de ocupación y entradas promedio por hora del día. Útil para heatmaps o gráficos de área.

**Parámetros:**

| Parámetro | Requerido | Descripción |
|-----------|-----------|-------------|
| `startDate` | Sí | Fecha inicio |
| `endDate` | Sí | Fecha fin |

**Ejemplo:** `GET /dashboard/peak-hours?startDate=2026-02-01&endDate=2026-02-28`

**Respuesta:**

```json
{
  "hourlyAverage": [
    {
      "hour": 0,
      "avgOccupancy": 12,
      "avgEntries": 3
    },
    {
      "hour": 8,
      "avgOccupancy": 85,
      "avgEntries": 45
    },
    {
      "hour": 18,
      "avgOccupancy": 92,
      "avgEntries": 52
    }
  ],
  "peakHour": {
    "hour": 18,
    "avgOccupancy": 92
  }
}
```

**Nota:** El array `hourlyAverage` debe contener las 24 horas del día (0-23).

---

### 6. Tiempo de Estancia

**Endpoint:** `GET /dashboard/stay-duration`

**Descripción:** Distribución del tiempo de permanencia de los vehículos. Para gráficos de barras/histogramas.

**Parámetros:**

| Parámetro | Requerido | Descripción |
|-----------|-----------|-------------|
| `startDate` | Sí | Fecha inicio |
| `endDate` | Sí | Fecha fin |

**Ejemplo:** `GET /dashboard/stay-duration?startDate=2026-02-01&endDate=2026-02-28`

**Respuesta:**

```json
{
  "averageMinutes": 127,
  "distribution": [
    {
      "range": "0-30min",
      "count": 450,
      "percentage": 10.5
    },
    {
      "range": "30min-1h",
      "count": 890,
      "percentage": 20.8
    },
    {
      "range": "1h-2h",
      "count": 1200,
      "percentage": 28.0
    },
    {
      "range": "2h-4h",
      "count": 980,
      "percentage": 22.9
    },
    {
      "range": "4h+",
      "count": 765,
      "percentage": 17.8
    }
  ]
}
```

---

### 7. Métodos de Pago

**Endpoint:** `GET /dashboard/payment-methods`

**Descripción:** Desglose de transacciones por método de pago. Para gráficos de pastel.

**Parámetros:**

| Parámetro | Requerido | Descripción |
|-----------|-----------|-------------|
| `startDate` | Sí | Fecha inicio |
| `endDate` | Sí | Fecha fin |

**Ejemplo:** `GET /dashboard/payment-methods?startDate=2026-02-01&endDate=2026-02-28`

**Respuesta:**

```json
{
  "data": [
    {
      "method": "EFECTIVO",
      "count": 2100,
      "revenue": 1200000.00,
      "percentage": 49.0
    },
    {
      "method": "TARJETA",
      "count": 1500,
      "revenue": 900000.00,
      "percentage": 35.0
    },
    {
      "method": "QR",
      "count": 685,
      "revenue": 400000.00,
      "percentage": 16.0
    }
  ]
}
```

---

### 8. Tipo de Clientes

**Endpoint:** `GET /dashboard/customer-types`

**Descripción:** Comparativa entre clientes ocasionales y abonados.

**Parámetros:**

| Parámetro | Requerido | Descripción |
|-----------|-----------|-------------|
| `startDate` | Sí | Fecha inicio |
| `endDate` | Sí | Fecha fin |

**Ejemplo:** `GET /dashboard/customer-types?startDate=2026-02-01&endDate=2026-02-28`

**Respuesta:**

```json
{
  "data": [
    {
      "type": "OCASIONAL",
      "entries": 3500,
      "revenue": 2100000.00,
      "percentage": 81.6
    },
    {
      "type": "ABONADO",
      "entries": 785,
      "revenue": 400000.00,
      "percentage": 18.4
    }
  ],
  "activeSubscriptions": 42
}
```

---

### 9. Comparativas Diarias

**Endpoint:** `GET /dashboard/daily-comparison`

**Descripción:** Comparación del día actual con períodos anteriores para mostrar tendencias.

**Parámetros:** Ninguno (calcula basándose en el día actual)

**Respuesta:**

```json
{
  "today": {
    "entries": 145,
    "exits": 130,
    "revenue": 85000.00
  },
  "yesterday": {
    "entries": 138,
    "exits": 142,
    "revenue": 82000.00
  },
  "lastWeekSameDay": {
    "entries": 152,
    "exits": 148,
    "revenue": 91000.00
  },
  "lastMonthSameDay": {
    "entries": 140,
    "exits": 135,
    "revenue": 78000.00
  }
}
```

---

### 10. Rotación de Espacios

**Endpoint:** `GET /dashboard/turnover-rate`

**Descripción:** Índice de rotación de espacios (cuántas veces promedio se usa un espacio por día).

**Parámetros:**

| Parámetro | Requerido | Descripción |
|-----------|-----------|-------------|
| `startDate` | Sí | Fecha inicio |
| `endDate` | Sí | Fecha fin |

**Ejemplo:** `GET /dashboard/turnover-rate?startDate=2026-02-01&endDate=2026-02-28`

**Respuesta:**

```json
{
  "averageTurnover": 3.2,
  "byZone": [
    {
      "zone": "A",
      "spaces": 50,
      "turnover": 4.1
    },
    {
      "zone": "B",
      "spaces": 60,
      "turnover": 2.8
    },
    {
      "zone": "C",
      "spaces": 40,
      "turnover": 2.5
    }
  ]
}
```

---

## Resumen de Endpoints y Componentes

| # | Endpoint | Componente UI | Gráfico Sugerido |
|---|----------|---------------|------------------|
| 1 | `/dashboard/overview` | Tarjetas KPI | Cards con iconos |
| 2 | `/dashboard/traffic` | Tráfico E/S | Líneas o Barras |
| 3 | `/dashboard/transactions` | Transacciones | Barras + Línea |
| 4 | `/dashboard/revenue-by-vehicle` | Por tipo vehículo | Donut/Pie |
| 5 | `/dashboard/peak-hours` | Horas pico | Heatmap o Área |
| 6 | `/dashboard/stay-duration` | Tiempo estancia | Histograma |
| 7 | `/dashboard/payment-methods` | Métodos pago | Donut/Pie |
| 8 | `/dashboard/customer-types` | Tipo clientes | Barras horizontales |
| 9 | `/dashboard/daily-comparison` | Comparativas | Cards con trends |
| 10 | `/dashboard/turnover-rate` | Rotación | Barras por zona |

---

## Consideraciones Técnicas

### Formato de Fechas
- Usar formato ISO 8601: `YYYY-MM-DD` para fechas
- Usar formato ISO 8601: `YYYY-MM-DDTHH:mm:ss.sssZ` para timestamps completos

### Formato de Moneda
- Todos los valores monetarios (`revenue`) deben enviarse como `number` (sin formato)
- El frontend se encargará del formateo con separadores de miles y símbolo de moneda

### Paginación
- Los endpoints del dashboard no requieren paginación ya que devuelven datos agregados

### Caché
- Se recomienda cachear `/dashboard/overview` por 30-60 segundos
- Endpoints con rangos de fechas pasadas pueden cachearse por más tiempo

### Errores
Los errores también siguen la estructura `GeneralResponse`:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid date range",
  "data": null
}
```

---

## Siguiente Pasos

1. [ ] Revisar y validar la estructura propuesta
2. [ ] Definir prioridades de implementación
3. [ ] Acordar valores por defecto para rangos de fechas
4. [ ] Definir si se requiere autenticación/autorización específica
5. [ ] Discutir si algún endpoint necesita WebSocket para tiempo real

---

**¿Preguntas o sugerencias?** Contactar al equipo de Frontend.
