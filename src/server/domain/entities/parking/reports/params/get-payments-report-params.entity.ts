export interface IChargeableFilter {
  value: string;
  label: string;
  type: 'Mensualidad' | 'Servicio Adicional' | 'Tarifa de Parqueo';
}

export interface IGetPaymentsReportParams {
  startDate: string;
  endDate: string;
  chargeableFilters?: IChargeableFilter[];
  emails?: string[];
}
