import {
    IGeneratePaymentParamsEntity,
    IGeneratePaymentResponseEntity,
    IListPaymentsParamsEntity,
    IListPaymentsResponseEntity,
    IPrintPaymentTicketResponseEntity,
    IValidateAmountParamsEntity,
    IValidateAmountResponseEntity,
} from "@/server/domain/index";

export abstract class PaymentRepository {

    abstract validateFee(params: IValidateAmountParamsEntity): Promise<IValidateAmountResponseEntity>;
    
    abstract generatePayment(params: IGeneratePaymentParamsEntity): Promise<IGeneratePaymentResponseEntity>;

    abstract listPayments(params: IListPaymentsParamsEntity): Promise<IListPaymentsResponseEntity>;

    abstract getPaymentPrintTicket(paymentId: string): Promise<IPrintPaymentTicketResponseEntity>;

}