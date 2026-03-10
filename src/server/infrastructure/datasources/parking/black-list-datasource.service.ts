import { injectable } from "tsyringe";
import { AxiosServerInstance } from "../axios-server.intance";
import {
  IListBlackListParamsEntity,
  IListBlackListResponseEntity,
  ICreateBlackListParamsEntity,
  IUpdateBlackListParamsEntity,
  BlackListRepository,
} from "@/server/domain/index";
import IEmptyResponse from "@/src/shared/interfaces/generic/empty-response";

@injectable()
export class BlackListDatasourceService extends AxiosServerInstance implements BlackListRepository {
  async list(params: IListBlackListParamsEntity): Promise<IListBlackListResponseEntity> {
    return this.api
      .get<IListBlackListResponseEntity>("/parking/black-list", { params })
      .then((response) => response.data);
  }

  async create(params: ICreateBlackListParamsEntity): Promise<IEmptyResponse> {
    return this.api
      .post<IEmptyResponse>("/parking/black-list", params)
      .then((response) => response.data);
  }

  async update(id: string, params: IUpdateBlackListParamsEntity): Promise<IEmptyResponse> {
    return this.api
      .put<IEmptyResponse>(`/parking/black-list/${id}`, params)
      .then((response) => response.data);
  }

  async deactivate(id: string): Promise<IEmptyResponse> {
    return this.api
      .put<IEmptyResponse>(`/parking/black-list/${id}/deactivate`)
      .then((response) => response.data);
  }
}
