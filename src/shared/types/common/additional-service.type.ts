export type TAdditionalService = {
  value: string;
  label: string;
  price: number;
  description?: string | null;
  /** Si el precio incluye impuestos */
  taxIncluded: boolean;
  /** Porcentaje de impuesto (ej: 19) */
  taxPercent: number;
};
