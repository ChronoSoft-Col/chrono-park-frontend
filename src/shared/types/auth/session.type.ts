import { TApplication } from "./application.type";

export type SessionTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type SessionUser = {
  id: string;
  email?: string | null;
  name?: string | null;
};

/**
 * Permisos almacenados en la cookie de sesión.
 * Solo se guarda el array plano de acciones para mantener la cookie por debajo de 4 KB.
 */
export type SessionPermission = {
  /** Todas las acciones del usuario como array plano */
  actions: string[];
};

/**
 * Versión ligera de TApplication para la sesión (sin actions/action).
 * Solo contiene los datos necesarios para la navegación del sidebar.
 */
export type SessionApplication = {
  id: string;
  name: string;
  path: string;
  isActive: boolean;
  resources: SessionResource[];
};

export type SessionResource = {
  id: string;
  name: string;
  path: string;
  icon: string;
  subresources: SessionSubResource[];
};

export type SessionSubResource = {
  id: string;
  name: string;
  path: string;
  icon: string;
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
  applications?: SessionApplication[];
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
