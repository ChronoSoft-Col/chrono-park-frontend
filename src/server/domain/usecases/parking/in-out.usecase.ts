import { inject, injectable } from "tsyringe";

import {
  IListInOutParamsEntity,
  IListInOutResponseEntity,
  InOutRepository,
} from "@/server/domain/index";

@injectable()
export class InOutUsecase implements InOutRepository {
  constructor(
    @inject("InOutRepository")
    private readonly inOutRepository: InOutRepository
  ) {}

  listInOuts(params: IListInOutParamsEntity): Promise<IListInOutResponseEntity> {
    return this.inOutRepository.listInOuts(params);
  }
}
