import { PlatformStrategy, PlayerCommand, clampVolume } from './types';

export const linuxStrategy: PlatformStrategy = {
  displayName: 'Linux',
  buildCommands(soundPath: string, volume: number): PlayerCommand[] {
    const v = clampVolume(volume);
    return [
      {
        command: 'paplay',
        args: ['--volume', String(Math.round(v * 65536)), soundPath],
      },
      {
        command: 'aplay',
        args: ['-q', soundPath],
      },
      {
        command: 'ffplay',
        args: ['-nodisp', '-autoexit', '-loglevel', 'quiet', '-volume', String(Math.round(v * 100)), soundPath],
      },
    ];
  },
};
