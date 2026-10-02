export interface PlayerCommand {
  command: string;
  args: string[];
}

export interface PlatformStrategy {
  displayName: string;
  buildCommands(soundPath: string, volume: number): PlayerCommand[];
}

export function clampVolume(volume: number): number {
  if (Number.isNaN(volume)) {
    return 1;
  }
  return Math.min(1, Math.max(0, volume));
}
