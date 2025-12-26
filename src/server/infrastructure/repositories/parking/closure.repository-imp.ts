import { injectable, inject } from "tsyringe";
import { ClosureRepository } from "@/server/domain/repositories/parking/closure.repository";
import { ICloseClosureParamsEntity } from "@/server/domain/entities/parking/close-closure-params.entity";
import { IClosureEntity } from "@/server/domain/entities/parking/closure.entity";
import { IListClosureParamsEntity } from "@/server/domain/entities/parking/list-closure-params.entity";
import { IListClosureResponseEntity } from "@/server/domain/entities/parking/list-closure-response.entity";
import { ClosureDatasourceService } from "@/server/infrastructure/datasources/parking/closure-datasource.service";

@injectable()
export class ClosureRepositoryImpl implements ClosureRepository {
  constructor(
    @inject("ClosureDatasourceService")
    private closureDatasource: ClosureDatasourceService
  ) {}

  async createClosure(params: ICloseClosureParamsEntity): Promise<IClosureEntity> {
    return this.closureDatasource.createClosure(params);
  }

  async listClosures(params: IListClosureParamsEntity): Promise<IListClosureResponseEntity> {
    return this.closureDatasource.listClosures(params);
  }

  async getClosureById(id: string): Promise<IClosureEntity> {
    return this.closureDatasource.getClosureById(id);
  }
}
