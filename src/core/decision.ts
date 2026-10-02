import type { EffectiveConfig, ProcessSource } from './nervousness';

export interface DecisionInput {
  source: ProcessSource;
  exitCode: number | undefined;
}

export interface DecisionState {
  lastPlayedAt: number | undefined;
  playing: boolean;
}

export interface DecisionResult {
  play: boolean;
  reason: string;
}

export function createDecisionState(): DecisionState {
  return { lastPlayedAt: undefined, playing: false };
}

export function shouldPlay(
  input: DecisionInput,
  config: EffectiveConfig,
  state: DecisionState,
  now: number
): DecisionResult {
  if (!config.enabled) {
    return { play: false, reason: 'nervousness ist "off"' };
  }

  if (!config.sources.includes(input.source)) {
    return { play: false, reason: `Quelle "${input.source}" ist in dieser Stufe deaktiviert` };
  }

  if (input.exitCode === undefined) {
    return { play: false, reason: 'kein Exit-Code verfügbar' };
  }

  if (input.exitCode === 0) {
    return { play: false, reason: 'Prozess war erfolgreich (Exit-Code 0)' };
  }

  if (config.ignoreExitCodes.includes(input.exitCode)) {
    return { play: false, reason: `Exit-Code ${input.exitCode} steht auf der Ignore-Liste` };
  }

  if (config.parallel === 'single' && state.playing) {
    return { play: false, reason: 'es läuft bereits ein Sound' };
  }

  if (
    config.cooldownMs > 0 &&
    state.lastPlayedAt !== undefined &&
    now - state.lastPlayedAt < config.cooldownMs
  ) {
    const remaining = config.cooldownMs - (now - state.lastPlayedAt);
    return { play: false, reason: `Cooldown aktiv (noch ${remaining}ms)` };
  }

  return { play: true, reason: `Exit-Code ${input.exitCode} (${input.source})` };
}
