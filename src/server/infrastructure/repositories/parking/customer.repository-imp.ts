import { inject, injectable } from "tsyringe";
import {
    CustomerDatasourceService
} from "@/server/infrastructure/index"
import { CustomerRepository, ICreateCustomerParamsEntity, IListCustomersParamsEntity, IListCustomersResponseEntity } from "@/src/server/domain";
import IEmptyResponse from "@/src/shared/interfaces/generic/empty-response";

@injectable()
export class CustomerRepositoryImp implements CustomerRepository {

    constructor(@inject(CustomerDatasourceService) private customerDatasourceService: CustomerDatasourceService) {}

    listCustomers(params: IListCustomersParamsEntity): Promise<IListCustomersResponseEntity> {
        return this.customerDatasourceService.listCustomers(params);
    }

    createCustomer(params: ICreateCustomerParamsEntity): Promise<IEmptyResponse> {
        return this.customerDatasourceService.createCustomer(params);
    }
}