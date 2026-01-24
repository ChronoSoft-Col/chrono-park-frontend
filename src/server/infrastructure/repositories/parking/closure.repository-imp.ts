import { injectable, inject } from "tsyringe";
import { ClosureRepository } from "@/server/domain/repositories/parking/closure.repository";
import { ClosureDatasourceService } from "@/server/infrastructure/datasources/parking/closure-datasource.service";
import { ICloseClosureParamsEntity, IClosureEntity, IListClosureParamsEntity, IListClosureResponseEntity } from "@/src/server/domain";

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
