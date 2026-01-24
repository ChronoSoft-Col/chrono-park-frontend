import { IClosureEntity } from "../../entities/parking/closures/closure.entity";
import { ICloseClosureParamsEntity } from "../../entities/parking/closures/params/close-closure-params.entity";
import { IListClosureParamsEntity } from "../../entities/parking/closures/params/list-closure-params.entity";
import { IListClosureResponseEntity } from "../../entities/parking/closures/response/list-closure-response.entity";


export abstract class ClosureRepository {
  abstract createClosure(params: ICloseClosureParamsEntity): Promise<IClosureEntity>;
  abstract listClosures(params: IListClosureParamsEntity): Promise<IListClosureResponseEntity>;
  abstract getClosureById(id: string): Promise<IClosureEntity>;
}
