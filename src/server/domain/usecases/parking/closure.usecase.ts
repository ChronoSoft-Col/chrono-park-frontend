import { injectable, inject } from "tsyringe";

import {
  ClosureRepository,
  ICloseClosureParamsEntity,
  IClosureEntity,
  IListClosureParamsEntity,
  IListClosureResponseEntity
} from "@/server/domain/index";


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
