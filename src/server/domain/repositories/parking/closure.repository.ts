import { ICloseClosureParamsEntity } from "../../entities/parking/close-closure-params.entity";
import { IClosureEntity } from "../../entities/parking/closure.entity";
import { IListClosureParamsEntity } from "../../entities/parking/list-closure-params.entity";
import { IListClosureResponseEntity } from "../../entities/parking/list-closure-response.entity";


export abstract class ClosureRepository {
  abstract createClosure(params: ICloseClosureParamsEntity): Promise<IClosureEntity>;
  abstract listClosures(params: IListClosureParamsEntity): Promise<IListClosureResponseEntity>;
  abstract getClosureById(id: string): Promise<IClosureEntity>;
}
