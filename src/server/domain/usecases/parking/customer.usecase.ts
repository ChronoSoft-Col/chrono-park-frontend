import { inject, injectable } from "tsyringe";
import {
    IListCustomersParamsEntity,
    IListCustomersResponseEntity,
    CustomerRepository,
    ICreateCustomerParamsEntity
} from "@/server/domain";
import IEmptyResponse from "@/src/shared/interfaces/generic/empty-response";

@injectable()
export class CustomerUsecase implements CustomerRepository {
    constructor(@inject("CustomerRepository") private readonly customerRepository: CustomerRepository) {}

    listCustomers(params: IListCustomersParamsEntity): Promise<IListCustomersResponseEntity> {
        return this.customerRepository.listCustomers(params);
    }

    createCustomer(params: ICreateCustomerParamsEntity): Promise<IEmptyResponse> {
        return this.customerRepository.createCustomer(params);
    }

    setCustomerActive(customerId: string, isActive: boolean): Promise<IEmptyResponse | void> {
        return this.customerRepository.setCustomerActive(customerId, isActive);
    }

    deleteCustomer(customerId: string): Promise<IEmptyResponse | void> {
        return this.customerRepository.deleteCustomer(customerId);
    }
}