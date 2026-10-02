import { spawn } from 'child_process';
import { Logger } from '../util/log';
import { PlatformStrategy, PlayerCommand } from './players/types';
import { macOSStrategy } from './players/macos';
import { windowsStrategy } from './players/windows';
import { linuxStrategy } from './players/linux';

export function strategyForPlatform(platform: string): PlatformStrategy | undefined {
  switch (platform) {
    case 'darwin':
      return macOSStrategy;
    case 'win32':
      return windowsStrategy;
    case 'linux':
      return linuxStrategy;
    default:
      return undefined;
  }
}

export function playSound(
  soundPath: string,
  volume: number,
  logger: Logger,
  platform: string = process.platform
): Promise<boolean> {
  const strategy = strategyForPlatform(platform);
  if (!strategy) {
    logger.warn(`Keine Audio-Strategie für Plattform "${platform}" vorhanden`);
    return Promise.resolve(false);
  }
  return tryCommands(strategy.buildCommands(soundPath, volume), 0, strategy, logger);
}

function tryCommands(
  commands: PlayerCommand[],
  index: number,
  strategy: PlatformStrategy,
  logger: Logger
): Promise<boolean> {
  if (index >= commands.length) {
    logger.warn(`Kein Audio-Player für ${strategy.displayName} gefunden`);
    return Promise.resolve(false);
  }

  const { command, args } = commands[index];

  return new Promise<boolean>((resolve) => {
    let settled = false;
    const child = spawn(command, args, { stdio: 'ignore' });

    child.once('error', (err: NodeJS.ErrnoException) => {
      if (settled) {
        return;
      }
      settled = true;
      logger.info(`Player "${command}" nicht verfügbar (${err.code ?? err.message}), versuche Alternative`);
      resolve(tryCommands(commands, index + 1, strategy, logger));
    });

    child.once('close', (code) => {
      if (settled) {
        return;
      }
      settled = true;
      if (code === 0) {
        logger.info(`Sound via "${command}" abgespielt (${strategy.displayName})`);
        resolve(true);
      } else {
        logger.warn(`Player "${command}" endete mit Code ${code}`);
        resolve(false);
      }
    });
  });
}
