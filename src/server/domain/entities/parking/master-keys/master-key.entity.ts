export interface IMasterKeyEntity {
  id: string;
  key: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IMasterKeyLogEntity {
  id: string;
  keyId: string;
  registerDeviceId: string;
  createdAt: string;
  masterKey?: {
    id: string;
    key: string;
  };
  registerDevice?: {
    id: string;
    name: string;
  };
}
