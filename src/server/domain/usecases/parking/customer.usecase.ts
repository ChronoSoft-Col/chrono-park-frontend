import { inject, injectable } from "tsyringe";
import {
    IListCustomersParamsEntity,
    IListCustomersResponseEntity,
    CustomerRepository
} from "@/server/domain";

@injectable()
export class CustomerUsecase implements CustomerRepository {
    constructor(@inject("CustomerRepository") private readonly customerRepository: CustomerRepository) {}

    listCustomers(params: IListCustomersParamsEntity): Promise<IListCustomersResponseEntity> {
        return this.customerRepository.listCustomers(params);
    }
}