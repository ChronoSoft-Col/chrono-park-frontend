import { injectable } from "tsyringe";
import { IGeneratePaymentParamsEntity, IGeneratePaymentResponseEntity, IValidateAmountParamsEntity, IValidateAmountResponseEntity, PaymentRepository } from "@/server/domain/index";
import { AxiosServerInstance } from "../axios-server.intance";
@injectable()
export class PaymentDatasourceService extends AxiosServerInstance implements PaymentRepository {
    async validateFee(params: IValidateAmountParamsEntity): Promise<IValidateAmountResponseEntity> {
        const { parkingSessionId, licensePlate, exitTime } = params;

        const identifier = parkingSessionId || licensePlate;
        if (!identifier) {
            throw new Error("Se requiere QR o placa para validar la tarifa");
        }

        return this.api
            .post<IValidateAmountResponseEntity>(`/parking-sessions/${identifier}/calculate-fee`, { exitTime })
            .then(response => response.data);
    }

    async generatePayment(params: IGeneratePaymentParamsEntity): Promise<IGeneratePaymentResponseEntity> {
        const { parkingSessionId, ...rest } = params;

        return this.api
            .post<IGeneratePaymentResponseEntity>(`/parking-sessions/${parkingSessionId}/checkout`, {
                ...rest,
                notes: rest.notes || ""
            })
            .then(response => {
                console.log(response.data);
                return response.data;
            });
    }
}