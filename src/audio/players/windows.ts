import { PlatformStrategy, PlayerCommand, clampVolume } from './types';

function escapeForPowerShell(value: string): string {
  return value.replace(/'/g, "''");
}

export const windowsStrategy: PlatformStrategy = {
  displayName: 'Windows',
  buildCommands(soundPath: string, volume: number): PlayerCommand[] {
    clampVolume(volume);
    const script = `(New-Object Media.SoundPlayer '${escapeForPowerShell(soundPath)}').PlaySync()`;
    const args = ['-NoProfile', '-NonInteractive', '-Command', script];
    return [
      { command: 'powershell', args },
      { command: 'pwsh', args },
    ];
  },
};
