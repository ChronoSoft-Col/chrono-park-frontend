import { inject, injectable } from "tsyringe";
import {
    IGeneratePaymentParamsEntity,
    IGeneratePaymentResponseEntity,
    IListPaymentsParamsEntity,
    IListPaymentsResponseEntity,
    IPrintPaymentTicketResponseEntity,
    IValidateAmountParamsEntity,
    IValidateAmountResponseEntity,
    PaymentRepository,
} from "@/server/domain/index";
import { PaymentDatasourceService } from "@/server/infrastructure/index";

@injectable()
export class PaymentRepositoryImp implements PaymentRepository {

    constructor(
        @inject("PaymentDatasourceService")
        private paymentDatasourceService: PaymentDatasourceService
    ){}

    async validateFee(params: IValidateAmountParamsEntity): Promise<IValidateAmountResponseEntity> {
        return this.paymentDatasourceService.validateFee(params);
    }

    async generatePayment(params: IGeneratePaymentParamsEntity): Promise<IGeneratePaymentResponseEntity> {
        return this.paymentDatasourceService.generatePayment(params);
    }

    async listPayments(params: IListPaymentsParamsEntity): Promise<IListPaymentsResponseEntity> {
        return this.paymentDatasourceService.listPayments(params);
    }

    async getPaymentPrintTicket(paymentId: string): Promise<IPrintPaymentTicketResponseEntity> {
        return this.paymentDatasourceService.getPaymentPrintTicket(paymentId);
    }
}