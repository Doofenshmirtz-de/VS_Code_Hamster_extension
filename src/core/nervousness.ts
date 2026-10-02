export type Nervousness = 'off' | 'mild' | 'normal' | 'chaos';
export type ProcessSource = 'terminal' | 'task';
export type ParallelMode = 'single' | 'each';

export interface EffectiveConfig {
  nervousness: Nervousness;
  enabled: boolean;
  sources: ProcessSource[];
  cooldownMs: number;
  volume: number;
  ignoreExitCodes: number[];
  parallel: ParallelMode;
}

interface Preset {
  sources: ProcessSource[];
  cooldownMs: number;
  ignoreExitCodes: number[];
  parallel: ParallelMode;
}

const PRESETS: Record<Nervousness, Preset> = {
  off: {
    sources: [],
    cooldownMs: 0,
    ignoreExitCodes: [],
    parallel: 'single',
  },
  mild: {
    sources: ['task'],
    cooldownMs: 10_000,
    ignoreExitCodes: [130],
    parallel: 'single',
  },
  normal: {
    sources: ['terminal', 'task'],
    cooldownMs: 5_000,
    ignoreExitCodes: [130],
    parallel: 'single',
  },
  chaos: {
    sources: ['terminal', 'task'],
    cooldownMs: 0,
    ignoreExitCodes: [],
    parallel: 'each',
  },
};

export interface RawSettings {
  nervousness: Nervousness;
  cooldownMs: number;
  cooldownMsExplicit: boolean;
  volume: number;
  ignoreExitCodes: number[];
  ignoreExitCodesExplicit: boolean;
}

export function isKnownNervousness(value: unknown): value is Nervousness {
  return value === 'off' || value === 'mild' || value === 'normal' || value === 'chaos';
}

export function resolveEffective(raw: RawSettings): EffectiveConfig {
  const preset = PRESETS[raw.nervousness];
  return {
    nervousness: raw.nervousness,
    enabled: raw.nervousness !== 'off',
    sources: preset.sources,
    cooldownMs: raw.cooldownMsExplicit ? raw.cooldownMs : preset.cooldownMs,
    volume: raw.volume,
    ignoreExitCodes: raw.ignoreExitCodesExplicit ? raw.ignoreExitCodes : preset.ignoreExitCodes,
    parallel: preset.parallel,
  };
}
