import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";

import {
  IListInOutParamsEntity,
  IListInOutResponseEntity,
  InOutRepository,
} from "@/server/domain/index";

@injectable()
export class InOutUsecase implements InOutRepository {
  constructor(
    @inject(SERVER_TOKENS.InOutRepository)
    private readonly inOutRepository: InOutRepository
  ) {}

  listInOuts(params: IListInOutParamsEntity): Promise<IListInOutResponseEntity> {
    return this.inOutRepository.listInOuts(params);
  }
}
