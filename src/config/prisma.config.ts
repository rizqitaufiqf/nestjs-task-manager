import { Prisma } from '@prisma/client';

export type LogLevel = 'info' | 'warn' | 'error' | 'query';
export type LogDefinition = {
  level: LogLevel;
  emit: 'stdout' | 'event';
};
export const PRISMA_LOG_CONFIG: Array<LogDefinition> = [
  { level: 'info', emit: 'stdout' },
  { level: 'warn', emit: 'stdout' },
  { level: 'error', emit: 'stdout' },
  { level: 'query', emit: 'stdout' },
];

export const PRISMA_CLIENT_OPTIONS: Prisma.PrismaClientOptions = {
  log: PRISMA_LOG_CONFIG,
};
