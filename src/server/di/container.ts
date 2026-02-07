import "reflect-metadata";
import { container } from "tsyringe";

import { SERVER_TOKENS } from "@/server/di/server-tokens";
import {
  ClosureUsecase,
  CommonUsecase,
  CustomerUsecase,
  InOutUsecase,
  LoginUseCase,
  ManualControlUseCase,
  PaymentUsecase,
  SubscriptionUsecase,
  SessionServiceUsecase,
} from "@/server/domain";
import {
  CommonDatasourceService,
  CommonRepositoryImp,
  CustomerDatasourceService,
  CustomerRepositoryImp,
  InOutDatasourceService,
  InOutRepositoryImp,
  LoginDatasourceService,
  LoginRepositoryImp,
  ManualControlDatasourceService,
  ManualControlRepositoryImp,
  PaymentDatasourceService,
  PaymentRepositoryImp,
} from "@/server/infrastructure";
import { ClosureDatasourceService } from "@/server/infrastructure/datasources/parking/closure-datasource.service";
import { ClosureRepositoryImpl } from "@/server/infrastructure/repositories/parking/closure.repository-imp";
import { SubscriptionDatasourceService } from "@/server/infrastructure/datasources/parking/subscription-datasource.service";
import { SubscriptionRepositoryImp } from "@/server/infrastructure/repositories/parking/subscription.repository-imp";
import { SessionServiceDatasourceService } from "@/server/infrastructure/datasources/parking/session-service-datasource.service";
import { SessionServiceRepositoryImp } from "@/server/infrastructure/repositories/parking/session-service.repository-imp";

if (!container.isRegistered(SERVER_TOKENS.LoginRepository)) {
  container.register(SERVER_TOKENS.LoginRepository, {
    useClass: LoginRepositoryImp,
  });
}

if (!container.isRegistered(SERVER_TOKENS.LoginDatasourceService)) {
  container.register(SERVER_TOKENS.LoginDatasourceService, {
    useClass: LoginDatasourceService,
  });
}

if (!container.isRegistered(SERVER_TOKENS.ManualControlRepository)) {
  container.register(SERVER_TOKENS.ManualControlRepository, {
    useClass: ManualControlRepositoryImp,
  });
}

if (!container.isRegistered(SERVER_TOKENS.ManualControlDatasourceService)) {
  container.register(SERVER_TOKENS.ManualControlDatasourceService, {
    useClass: ManualControlDatasourceService,
  });
}

if (!container.isRegistered(SERVER_TOKENS.InOutRepository)) {
  container.register(SERVER_TOKENS.InOutRepository, {
    useClass: InOutRepositoryImp,
  });
}

if (!container.isRegistered(SERVER_TOKENS.InOutDatasourceService)) {
  container.register(SERVER_TOKENS.InOutDatasourceService, {
    useClass: InOutDatasourceService,
  });
}

if (!container.isRegistered(SERVER_TOKENS.CommonDatasourceService)) {
  container.register(SERVER_TOKENS.CommonDatasourceService, {
    useClass: CommonDatasourceService,
  });
}

if (!container.isRegistered(SERVER_TOKENS.CommonRepository)) {
  container.register(SERVER_TOKENS.CommonRepository, { useClass: CommonRepositoryImp });
}

if (!container.isRegistered(SERVER_TOKENS.PaymentDatasourceService)) {
  container.register(SERVER_TOKENS.PaymentDatasourceService, { useClass: PaymentDatasourceService });
}

if (!container.isRegistered(SERVER_TOKENS.PaymentRepository)) {
  container.register(SERVER_TOKENS.PaymentRepository, { useClass: PaymentRepositoryImp });
}

if (!container.isRegistered(SERVER_TOKENS.ClosureDatasourceService)) {
  container.register(SERVER_TOKENS.ClosureDatasourceService, {
    useClass: ClosureDatasourceService,
  });
}

if (!container.isRegistered(SERVER_TOKENS.ClosureRepository)) {
  container.register(SERVER_TOKENS.ClosureRepository, {
    useClass: ClosureRepositoryImpl,
  });
}

if (!container.isRegistered(SERVER_TOKENS.CustomerRepository)) {
  container.register(SERVER_TOKENS.CustomerRepository, { useClass: CustomerRepositoryImp });
}

if (!container.isRegistered(SERVER_TOKENS.CustomerDatasourceService)) {
  container.register(SERVER_TOKENS.CustomerDatasourceService, { useClass: CustomerDatasourceService });
}

if (!container.isRegistered(SERVER_TOKENS.LoginUseCase)) {
  container.register(SERVER_TOKENS.LoginUseCase, { useClass: LoginUseCase });
}

if (!container.isRegistered(SERVER_TOKENS.ManualControlUseCase)) {
  container.register(SERVER_TOKENS.ManualControlUseCase, { useClass: ManualControlUseCase });
}

if (!container.isRegistered(SERVER_TOKENS.CommonUsecase)) {
  container.register(SERVER_TOKENS.CommonUsecase, { useClass: CommonUsecase });
}

if (!container.isRegistered(SERVER_TOKENS.PaymentUsecase)) {
  container.register(SERVER_TOKENS.PaymentUsecase, { useClass: PaymentUsecase });
}

if (!container.isRegistered(SERVER_TOKENS.InOutUsecase)) {
  container.register(SERVER_TOKENS.InOutUsecase, { useClass: InOutUsecase });
}

if (!container.isRegistered(SERVER_TOKENS.CustomerUsecase)) {
  container.register(SERVER_TOKENS.CustomerUsecase, { useClass: CustomerUsecase });
}

if (!container.isRegistered(SERVER_TOKENS.ClosureUsecase)) {
  container.register(SERVER_TOKENS.ClosureUsecase, { useClass: ClosureUsecase });
}

if (!container.isRegistered(SERVER_TOKENS.SubscriptionDatasourceService)) {
  container.register(SERVER_TOKENS.SubscriptionDatasourceService, {
    useClass: SubscriptionDatasourceService,
  });
}

if (!container.isRegistered(SERVER_TOKENS.SubscriptionRepository)) {
  container.register(SERVER_TOKENS.SubscriptionRepository, {
    useClass: SubscriptionRepositoryImp,
  });
}

if (!container.isRegistered(SERVER_TOKENS.SubscriptionUsecase)) {
  container.register(SERVER_TOKENS.SubscriptionUsecase, { useClass: SubscriptionUsecase });
}

if (!container.isRegistered(SERVER_TOKENS.SessionServiceDatasource)) {
  container.register(SERVER_TOKENS.SessionServiceDatasource, {
    useClass: SessionServiceDatasourceService,
  });
}

if (!container.isRegistered(SERVER_TOKENS.SessionServiceRepository)) {
  container.register(SERVER_TOKENS.SessionServiceRepository, {
    useClass: SessionServiceRepositoryImp,
  });
}

if (!container.isRegistered(SERVER_TOKENS.SessionServiceUsecase)) {
  container.register(SERVER_TOKENS.SessionServiceUsecase, { useClass: SessionServiceUsecase });
}

// set-company bindings removed (companies flow deprecated)

export { container as serverContainer };
