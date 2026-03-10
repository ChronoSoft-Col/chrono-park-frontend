export interface IListMasterKeyLogsParamsEntity {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
  keyId?: string;
  registerDeviceId?: string;
}
