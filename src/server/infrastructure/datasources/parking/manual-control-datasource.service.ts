import { IGenerateManualIncomeParamsEntity, IGenerateManualIncomeResponse, ManualControlRepository } from "@/server/domain/index";
import { AxiosServerInstance } from "../axios-server.intance";
import { injectable } from "tsyringe";

@injectable()
export class ManualControlDatasourceService extends AxiosServerInstance implements ManualControlRepository {
    generateManualIncome(params: IGenerateManualIncomeParamsEntity): Promise<IGenerateManualIncomeResponse> {
        return this.api.post<IGenerateManualIncomeResponse>("/parking-sessions/manual-entry", params).then(response => {
            console.log("Response Data:", response.data);
            return response.data;
        });
    }

    getEntryTicket(parkingSessionId: string): Promise<IGenerateManualIncomeResponse> {
        return this.api.get<IGenerateManualIncomeResponse>(`/parking-sessions/${parkingSessionId}/entry-ticket`).then(response => {
            return response.data;
        });
    }
}