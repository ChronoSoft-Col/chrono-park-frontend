import { injectable } from "tsyringe";
import { AxiosServerInstance } from "../axios-server.intance";
import {
  IListWhiteListParamsEntity,
  IListWhiteListResponseEntity,
  ICreateWhiteListParamsEntity,
  IUpdateWhiteListParamsEntity,
  WhiteListRepository,
} from "@/server/domain/index";
import IEmptyResponse from "@/src/shared/interfaces/generic/empty-response";

@injectable()
export class WhiteListDatasourceService extends AxiosServerInstance implements WhiteListRepository {
  async list(params: IListWhiteListParamsEntity): Promise<IListWhiteListResponseEntity> {
    return this.api
      .get<IListWhiteListResponseEntity>("/parking/white-list", { params })
      .then((response) => response.data);
  }

  async create(params: ICreateWhiteListParamsEntity): Promise<IEmptyResponse> {
    return this.api
      .post<IEmptyResponse>("/parking/white-list", params)
      .then((response) => response.data);
  }

  async update(id: string, params: IUpdateWhiteListParamsEntity): Promise<IEmptyResponse> {
    return this.api
      .put<IEmptyResponse>(`/parking/white-list/${id}`, params)
      .then((response) => response.data);
  }

  async deactivate(id: string): Promise<IEmptyResponse> {
    return this.api
      .put<IEmptyResponse>(`/parking/white-list/${id}/deactivate`)
      .then((response) => response.data);
  }
}
