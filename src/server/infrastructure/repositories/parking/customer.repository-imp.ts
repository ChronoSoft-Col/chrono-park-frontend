import { inject, injectable } from "tsyringe";
import {
    CustomerDatasourceService
} from "@/server/infrastructure/index"
import { CustomerRepository, ICreateCustomerParamsEntity, IListCustomersParamsEntity, IListCustomersResponseEntity, IUpdateCustomerParamsEntity, IUpdateCustomerResponseEntity } from "@/src/server/domain";
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

    updateCustomer(customerId: string, params: IUpdateCustomerParamsEntity): Promise<IUpdateCustomerResponseEntity> {
        return this.customerDatasourceService.updateCustomer(customerId, params);
    }

    setCustomerActive(customerId: string, isActive: boolean): Promise<IEmptyResponse | void> {
        return this.customerDatasourceService.setCustomerActive(customerId, isActive);
    }

    deleteCustomer(customerId: string): Promise<IEmptyResponse | void> {
        return this.customerDatasourceService.deleteCustomer(customerId);
    }
}