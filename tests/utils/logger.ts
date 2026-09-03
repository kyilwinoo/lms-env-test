// utils/logger.ts

export enum LogLevel {
  INFO = 'INFO',
  STEP = 'STEP',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

export function log(message: string, level: LogLevel = LogLevel.INFO) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

export function logStep(step: string) {
  log(`Step: ${step}`, LogLevel.STEP);
}

export function logAssert(description: string, passed: boolean) {
  log(`Assertion: ${description} - ${passed ? '✅ Passed' : '❌ Failed'}`, passed ? LogLevel.INFO : LogLevel.ERROR);
}
