import { injectable } from "tsyringe";
import { AxiosServerInstance } from "../axios-server.intance";
import {
  IListMasterKeysParamsEntity,
  IListMasterKeysResponseEntity,
  ICreateMasterKeyParamsEntity,
  IUpdateMasterKeyParamsEntity,
  IListMasterKeyLogsParamsEntity,
  IListMasterKeyLogsResponseEntity,
  MasterKeysRepository,
} from "@/server/domain/index";
import IEmptyResponse from "@/src/shared/interfaces/generic/empty-response";

@injectable()
export class MasterKeysDatasourceService extends AxiosServerInstance implements MasterKeysRepository {
  async list(params: IListMasterKeysParamsEntity): Promise<IListMasterKeysResponseEntity> {
    return this.api
      .get<IListMasterKeysResponseEntity>("/parking/master-keys", { params })
      .then((response) => response.data);
  }

  async create(params: ICreateMasterKeyParamsEntity): Promise<IEmptyResponse> {
    return this.api
      .post<IEmptyResponse>("/parking/master-keys", params)
      .then((response) => response.data);
  }

  async update(id: string, params: IUpdateMasterKeyParamsEntity): Promise<IEmptyResponse> {
    return this.api
      .put<IEmptyResponse>(`/parking/master-keys/${id}`, params)
      .then((response) => response.data);
  }

  async deactivate(id: string): Promise<IEmptyResponse> {
    return this.api
      .put<IEmptyResponse>(`/parking/master-keys/${id}/deactivate`)
      .then((response) => response.data);
  }

  async listLogs(params: IListMasterKeyLogsParamsEntity): Promise<IListMasterKeyLogsResponseEntity> {
    return this.api
      .get<IListMasterKeyLogsResponseEntity>("/parking/master-keys/logs", { params })
      .then((response) => response.data);
  }
}
