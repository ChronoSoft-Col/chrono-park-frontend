import { injectable, inject } from "tsyringe";
import { ICloseClosureParamsEntity } from "../../entities/parking/close-closure-params.entity";
import { IClosureEntity } from "../../entities/parking/closure.entity";
import { IListClosureParamsEntity } from "../../entities/parking/list-closure-params.entity";
import { IListClosureResponseEntity } from "../../entities/parking/list-closure-response.entity";
import { ClosureRepository } from "../../repositories/parking/closure.repository";


@injectable()
export class ClosureUsecase {
  constructor(@inject("ClosureRepository") private closureRepository: ClosureRepository) {}

  async createClosure(params: ICloseClosureParamsEntity): Promise<IClosureEntity> {
    return this.closureRepository.createClosure(params);
  }

  async listClosures(params: IListClosureParamsEntity): Promise<IListClosureResponseEntity> {
    return this.closureRepository.listClosures(params);
  }

  async getClosureById(id: string): Promise<IClosureEntity> {
    return this.closureRepository.getClosureById(id);
  }
}
