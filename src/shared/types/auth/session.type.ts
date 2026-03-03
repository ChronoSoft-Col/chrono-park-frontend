import TUser from "./user.type";
import { TApplication } from "./application.type";

export type SessionTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type SessionUser = Partial<TUser> & {
  id: string;
  email?: string | null;
  name?: string | null;
  [key: string]: unknown;
};

/**
 * Permisos por aplicación y recurso, más un array plano de todas las acciones
 * para búsqueda rápida.
 */
export type SessionResourcePermission = {
  resourceId: string;
  resourceName: string;
  actions: string[];
};

export type SessionApplicationPermission = {
  applicationId: string;
  applicationName: string;
  resources: SessionResourcePermission[];
};

export type SessionPermission = {
  /** Todas las acciones del usuario como array plano (para búsqueda rápida) */
  actions: string[];
  /** Permisos organizados por aplicación → recurso → acciones */
  applications: SessionApplicationPermission[];
};

export type SessionMetadata = {
  maxAge: number;
  issuedAt: number;
  expiresAt: number;
  [key: string]: unknown;
};

export type SessionPayload = {
  user: SessionUser;
  permissions: SessionPermission | null;
  tokens: SessionTokens;
  role?: { id: string; name: string } | null;
  applications?: TApplication[];
  metadata: SessionMetadata;
};

export type CreateSessionInput = {
  user: SessionUser;
  permissions?: SessionPermission | null;
  tokens: SessionTokens;
  role?: { id: string; name: string } | null;
  applications?: TApplication[];
  metadata?: Partial<SessionMetadata>;
  maxAge?: number;
};
