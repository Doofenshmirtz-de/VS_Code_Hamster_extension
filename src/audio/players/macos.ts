import { PlatformStrategy, PlayerCommand, clampVolume } from './types';

export const macOSStrategy: PlatformStrategy = {
  displayName: 'macOS',
  buildCommands(soundPath: string, volume: number): PlayerCommand[] {
    return [
      {
        command: 'afplay',
        args: ['-v', clampVolume(volume).toFixed(2), soundPath],
      },
    ];
  },
};
