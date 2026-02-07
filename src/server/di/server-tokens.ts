export const SERVER_TOKENS = {
  // UseCases
  LoginUseCase: Symbol.for("server:LoginUseCase"),
  ManualControlUseCase: Symbol.for("server:ManualControlUseCase"),
  CommonUsecase: Symbol.for("server:CommonUsecase"),
  PaymentUsecase: Symbol.for("server:PaymentUsecase"),
  InOutUsecase: Symbol.for("server:InOutUsecase"),
  CustomerUsecase: Symbol.for("server:CustomerUsecase"),
  ClosureUsecase: Symbol.for("server:ClosureUsecase"),
  SubscriptionUsecase: Symbol.for("server:SubscriptionUsecase"),
  SessionServiceUsecase: Symbol.for("server:SessionServiceUsecase"),

  // Repositories
  LoginRepository: Symbol.for("server:LoginRepository"),
  ManualControlRepository: Symbol.for("server:ManualControlRepository"),
  CommonRepository: Symbol.for("server:CommonRepository"),
  PaymentRepository: Symbol.for("server:PaymentRepository"),
  InOutRepository: Symbol.for("server:InOutRepository"),
  CustomerRepository: Symbol.for("server:CustomerRepository"),
  ClosureRepository: Symbol.for("server:ClosureRepository"),
  SubscriptionRepository: Symbol.for("server:SubscriptionRepository"),
  SessionServiceRepository: Symbol.for("server:SessionServiceRepository"),

  // Datasources
  LoginDatasourceService: Symbol.for("server:LoginDatasourceService"),
  ManualControlDatasourceService: Symbol.for("server:ManualControlDatasourceService"),
  CommonDatasourceService: Symbol.for("server:CommonDatasourceService"),
  PaymentDatasourceService: Symbol.for("server:PaymentDatasourceService"),
  InOutDatasourceService: Symbol.for("server:InOutDatasourceService"),
  CustomerDatasourceService: Symbol.for("server:CustomerDatasourceService"),
  ClosureDatasourceService: Symbol.for("server:ClosureDatasourceService"),
  SubscriptionDatasourceService: Symbol.for("server:SubscriptionDatasourceService"),
  SessionServiceDatasource: Symbol.for("server:SessionServiceDatasource"),
} as const;
