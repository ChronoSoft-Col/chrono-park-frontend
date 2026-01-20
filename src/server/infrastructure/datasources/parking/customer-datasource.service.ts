import { injectable } from "tsyringe";
import { AxiosServerInstance } from "../axios-server.intance";
import { IListCustomersParamsEntity, IListCustomersResponseEntity, CustomerRepository } from "@/server/domain/index";

@injectable()
export class CustomerDatasourceService extends AxiosServerInstance implements CustomerRepository {
    async listCustomers(params: IListCustomersParamsEntity): Promise<IListCustomersResponseEntity> {
        return this.api
            .get<IListCustomersResponseEntity>("/customers", { params })
            .then(response => response.data);
    }
}