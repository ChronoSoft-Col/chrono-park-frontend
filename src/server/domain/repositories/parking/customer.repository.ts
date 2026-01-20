import {
    IListCustomersParamsEntity,
    IListCustomersResponseEntity
} from "@/server/domain";

export abstract class CustomerRepository {
    abstract listCustomers(params: IListCustomersParamsEntity): Promise<IListCustomersResponseEntity>;
}