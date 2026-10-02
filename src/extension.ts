import * as vscode from 'vscode';
import { readConfig } from './config';
import { createDecisionState, shouldPlay } from './core/decision';
import { playSound } from './audio/player';
import { createLogger } from './util/log';
import { ProcessSignal, registerTerminalWatcher } from './watchers/terminal';
import { registerTaskWatcher } from './watchers/task';

export function activate(context: vscode.ExtensionContext): void {
  const logger = createLogger();
  context.subscriptions.push(logger);

  const state = createDecisionState();
  const soundPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'death.wav').fsPath;

  logger.info(`Hamster Error Sound aktiv. Sound-Datei: ${soundPath}`);

  const handleSignal = (signal: ProcessSignal): void => {
    const config = readConfig();
    const now = Date.now();
    const decision = shouldPlay(signal, config, state, now);

    if (!decision.play) {
      logger.info(`Kein Sound (${signal.label}): ${decision.reason}`);
      return;
    }

    logger.info(`Sound auslösen (${signal.label}): ${decision.reason}`);
    state.lastPlayedAt = now;
    state.playing = true;
    void playSound(soundPath, config.volume, logger).finally(() => {
      state.playing = false;
    });
  };

  context.subscriptions.push(registerTerminalWatcher(handleSignal, logger));
  context.subscriptions.push(registerTaskWatcher(handleSignal, logger));

  context.subscriptions.push(
    vscode.commands.registerCommand('hamster.playSound', () => {
      const config = readConfig();
      state.playing = true;
      void playSound(soundPath, config.volume, logger).finally(() => {
        state.playing = false;
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('hamster.showLog', () => {
      logger.show();
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('hamster')) {
        const config = readConfig();
        logger.info(`Konfiguration geändert: nervousness=${config.nervousness}, cooldownMs=${config.cooldownMs}`);
      }
    })
  );
}

export function deactivate(): void {
  // nichts aufzuräumen
}
