import * as vscode from 'vscode';

export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export interface LoggerWithDisposable extends Logger, vscode.Disposable {}

export function createLogger(): LoggerWithDisposable {
  const channel = vscode.window.createOutputChannel('Hamster Error Sound');
  const stamp = (level: string, message: string) =>
    channel.appendLine(`[${new Date().toISOString()}] [${level}] ${message}`);
  return {
    info: (message) => stamp('info', message),
    warn: (message) => stamp('warn', message),
    error: (message) => stamp('error', message),
    dispose: () => channel.dispose(),
  };
}
