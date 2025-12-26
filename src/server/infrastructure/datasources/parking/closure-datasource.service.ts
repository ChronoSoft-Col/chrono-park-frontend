import { injectable } from "tsyringe";
import { ClosureRepository } from "@/server/domain/repositories/parking/closure.repository";
import { ICloseClosureParamsEntity } from "@/server/domain/entities/parking/close-closure-params.entity";
import { IClosureEntity } from "@/server/domain/entities/parking/closure.entity";
import { IListClosureParamsEntity } from "@/server/domain/entities/parking/list-closure-params.entity";
import { IListClosureResponseEntity } from "@/server/domain/entities/parking/list-closure-response.entity";
import { AxiosServerInstance } from "../axios-server.intance";
import type IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

@injectable()
export class ClosureDatasourceService extends AxiosServerInstance implements ClosureRepository {
  private unwrapGeneralResponse<T>(payload: unknown): T {
    if (payload && typeof payload === "object") {
      const maybe = payload as { data?: unknown; success?: unknown; statusCode?: unknown };
      const looksLikeEnvelope =
        typeof maybe.success === "boolean" &&
        typeof maybe.statusCode === "number" &&
        "data" in maybe;

      if (looksLikeEnvelope) {
        return (maybe.data as T);
      }
    }

    return payload as T;
  }

  async createClosure(params: ICloseClosureParamsEntity): Promise<IClosureEntity> {
    return this.api
      .post<IGeneralResponse<IClosureEntity> | IClosureEntity>("/closures/create", params)
      .then((response) => this.unwrapGeneralResponse<IClosureEntity>(response.data));
  }

  async listClosures(params: IListClosureParamsEntity): Promise<IListClosureResponseEntity> {
    return this.api
      .get<IListClosureResponseEntity>("/closures/list", { params })
      .then((response) => response.data);
  }

  async getClosureById(id: string): Promise<IClosureEntity> {
    return this.api
      .get<IGeneralResponse<IClosureEntity> | IClosureEntity>(`/closures/${id}`)
      .then((response) => this.unwrapGeneralResponse<IClosureEntity>(response.data));
  }
}
