import { IGeneratePaymentParamsEntity, IGeneratePaymentResponseEntity, IValidateAmountParamsEntity, IValidateAmountResponseEntity } from "@/server/domain/index"

export abstract class PaymentRepository {

    abstract validateFee(params: IValidateAmountParamsEntity): Promise<IValidateAmountResponseEntity>;
    
    abstract generatePayment(params: IGeneratePaymentParamsEntity): Promise<IGeneratePaymentResponseEntity>;

}