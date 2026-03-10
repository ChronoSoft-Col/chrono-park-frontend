import {
  IListMasterKeysParamsEntity,
  IListMasterKeysResponseEntity,
  ICreateMasterKeyParamsEntity,
  IUpdateMasterKeyParamsEntity,
  IListMasterKeyLogsParamsEntity,
  IListMasterKeyLogsResponseEntity,
} from "@/server/domain";
import IEmptyResponse from "@/src/shared/interfaces/generic/empty-response";

export abstract class MasterKeysRepository {
  abstract list(params: IListMasterKeysParamsEntity): Promise<IListMasterKeysResponseEntity>;
  abstract create(params: ICreateMasterKeyParamsEntity): Promise<IEmptyResponse>;
  abstract update(id: string, params: IUpdateMasterKeyParamsEntity): Promise<IEmptyResponse>;
  abstract deactivate(id: string): Promise<IEmptyResponse>;
  abstract listLogs(params: IListMasterKeyLogsParamsEntity): Promise<IListMasterKeyLogsResponseEntity>;
}
