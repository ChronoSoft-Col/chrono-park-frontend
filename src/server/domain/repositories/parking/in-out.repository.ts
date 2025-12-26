import { IListInOutParamsEntity, IListInOutResponseEntity } from "@/server/domain/index";

export abstract class InOutRepository {
    abstract listInOuts(
        params: IListInOutParamsEntity
    ): Promise<IListInOutResponseEntity>;
}