import { inject, injectable } from "tsyringe";
import { CustomerDatasourceService } from "../..";
import { CustomerRepository, IListCustomersParamsEntity, IListCustomersResponseEntity } from "@/src/server/domain";

@injectable()
export class CustomerRepositoryImp implements CustomerRepository {

    constructor(@inject(CustomerDatasourceService) private customerDatasourceService: CustomerDatasourceService) {}

    listCustomers(params: IListCustomersParamsEntity): Promise<IListCustomersResponseEntity> {
        return this.customerDatasourceService.listCustomers(params);
    }
}