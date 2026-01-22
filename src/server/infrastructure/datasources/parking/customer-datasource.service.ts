import { injectable } from "tsyringe";
import { AxiosServerInstance } from "../axios-server.intance";
import { IListCustomersParamsEntity, IListCustomersResponseEntity, CustomerRepository, ICreateCustomerParamsEntity, IUpdateCustomerParamsEntity, IUpdateCustomerResponseEntity } from "@/server/domain/index";
import IEmptyResponse from "@/src/shared/interfaces/generic/empty-response";

@injectable()
export class CustomerDatasourceService extends AxiosServerInstance implements CustomerRepository {
    async listCustomers(params: IListCustomersParamsEntity): Promise<IListCustomersResponseEntity> {
        return this.api
            .get<IListCustomersResponseEntity>("/customers", { params })
            .then(response => response.data);
    }

    async createCustomer(params: ICreateCustomerParamsEntity): Promise<IEmptyResponse> {
        return this.api
            .post<IEmptyResponse>("/customers", params)
            .then(response => response.data);
    }

    async updateCustomer(customerId: string, params: IUpdateCustomerParamsEntity): Promise<IUpdateCustomerResponseEntity> {
        return this.api
            .put<IUpdateCustomerResponseEntity>(`/customers/${customerId}`, params)
            .then(response => response.data);
    }

    async setCustomerActive(customerId: string, isActive: boolean): Promise<IEmptyResponse | void> {
        return this.api
            .put<IEmptyResponse>(`/customers/${customerId}`, { isActive })
            .then(response => response.data);
    }

    async deleteCustomer(customerId: string): Promise<IEmptyResponse | void> {
        return this.api
            .delete<IEmptyResponse>(`/customers/${customerId}`)
            .then(response => response.data);
    }
}