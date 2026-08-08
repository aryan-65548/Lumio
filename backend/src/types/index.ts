import { Request } from 'express';

export type ThemeType = 'goa' | 'aot';
export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface JWTPayload {
  sub: string;
  sessionId: string;
  type: 'anonymous';
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
  file?: Express.Multer.File;
}

export interface GenerationInput {
  theme: ThemeType;
  name: string;
  role: string;
  techStack: string;
  builderTitle: string;
  posterBase64?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
