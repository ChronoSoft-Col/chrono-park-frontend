import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import {
    IListCustomersParamsEntity,
    IListCustomersResponseEntity,
    CustomerRepository,
    ICreateCustomerParamsEntity,
    IUpdateCustomerParamsEntity,
    IUpdateCustomerResponseEntity
} from "@/server/domain";
import IEmptyResponse from "@/shared/interfaces/generic/empty-response";

@injectable()
export class CustomerUsecase implements CustomerRepository {
    constructor(@inject(SERVER_TOKENS.CustomerRepository) private readonly customerRepository: CustomerRepository) {}

    listCustomers(params: IListCustomersParamsEntity): Promise<IListCustomersResponseEntity> {
        return this.customerRepository.listCustomers(params);
    }

    createCustomer(params: ICreateCustomerParamsEntity): Promise<IEmptyResponse> {
        return this.customerRepository.createCustomer(params);
    }

    updateCustomer(customerId: string, params: IUpdateCustomerParamsEntity): Promise<IUpdateCustomerResponseEntity> {
        return this.customerRepository.updateCustomer(customerId, params);
    }

    setCustomerActive(customerId: string, isActive: boolean): Promise<IEmptyResponse | void> {
        return this.customerRepository.setCustomerActive(customerId, isActive);
    }

    deleteCustomer(customerId: string): Promise<IEmptyResponse | void> {
        return this.customerRepository.deleteCustomer(customerId);
    }
}