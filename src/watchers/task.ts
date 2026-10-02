import * as vscode from 'vscode';
import { Logger } from '../util/log';
import { SignalHandler } from './terminal';

export function registerTaskWatcher(onSignal: SignalHandler, logger: Logger): vscode.Disposable {
  return vscode.tasks.onDidEndTaskProcess((event) => {
    const label = event.execution.task.name;
    logger.info(`Task beendet: "${label}" -> Exit-Code ${event.exitCode}`);
    onSignal({ source: 'task', exitCode: event.exitCode, label });
  });
}
