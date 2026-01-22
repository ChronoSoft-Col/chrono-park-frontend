import {
    IListCustomersParamsEntity,
    IListCustomersResponseEntity,
    ICreateCustomerParamsEntity,
    IUpdateCustomerParamsEntity,
    IUpdateCustomerResponseEntity,
} from "@/server/domain";
import IEmptyResponse from "@/src/shared/interfaces/generic/empty-response";

export abstract class CustomerRepository {
    abstract listCustomers(params: IListCustomersParamsEntity): Promise<IListCustomersResponseEntity>;
    abstract createCustomer(params: ICreateCustomerParamsEntity): Promise<IEmptyResponse>;
    abstract updateCustomer(customerId: string, params: IUpdateCustomerParamsEntity): Promise<IUpdateCustomerResponseEntity>;
    abstract setCustomerActive(customerId: string, isActive: boolean): Promise<IEmptyResponse | void>;
    abstract deleteCustomer(customerId: string): Promise<IEmptyResponse | void>;
}