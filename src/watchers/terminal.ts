import * as vscode from 'vscode';
import { ProcessSource } from '../core/nervousness';
import { Logger } from '../util/log';

export interface ProcessSignal {
  source: ProcessSource;
  exitCode: number | undefined;
  label: string;
}

export type SignalHandler = (signal: ProcessSignal) => void;

export function registerTerminalWatcher(onSignal: SignalHandler, logger: Logger): vscode.Disposable {
  return vscode.window.onDidEndTerminalShellExecution((event) => {
    const command = event.execution.commandLine?.value ?? '';
    const label = command.length > 0 ? command : event.terminal.name;
    logger.info(`Terminal-Prozess beendet: "${label}" -> Exit-Code ${event.exitCode}`);
    onSignal({ source: 'terminal', exitCode: event.exitCode, label });
  });
}
