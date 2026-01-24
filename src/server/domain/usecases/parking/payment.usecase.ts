import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";

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

@injectable()
export class PaymentUsecase implements PaymentRepository{
    constructor(
        @inject(SERVER_TOKENS.PaymentRepository) private paymentRepository: PaymentRepository
    ) {}

    validateFee(params: IValidateAmountParamsEntity): Promise<IValidateAmountResponseEntity> {
        return this.paymentRepository.validateFee(params);
    }

    generatePayment(params: IGeneratePaymentParamsEntity): Promise<IGeneratePaymentResponseEntity> {
        return this.paymentRepository.generatePayment(params);
    }

    listPayments(params: IListPaymentsParamsEntity): Promise<IListPaymentsResponseEntity> {
        return this.paymentRepository.listPayments(params);
    }

    getPaymentPrintTicket(paymentId: string): Promise<IPrintPaymentTicketResponseEntity> {
        return this.paymentRepository.getPaymentPrintTicket(paymentId);
    }
}