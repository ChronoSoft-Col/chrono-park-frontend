import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import { IMasterKeyLogEntity } from "../master-key.entity";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IListMasterKeyLogsResponseEntity extends IGeneralResponse<IMasterKeyLogEntity, true> {}
