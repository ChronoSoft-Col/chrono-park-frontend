import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import { IMasterKeyEntity } from "../master-key.entity";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IListMasterKeysResponseEntity extends IGeneralResponse<IMasterKeyEntity, true> {}
