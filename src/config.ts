import * as vscode from 'vscode';
import {
  EffectiveConfig,
  Nervousness,
  RawSettings,
  isKnownNervousness,
  resolveEffective,
} from './core/nervousness';

function isExplicitlySet(value: unknown): boolean {
  return value !== undefined;
}

export function readConfig(): EffectiveConfig {
  const cfg = vscode.workspace.getConfiguration('hamster');

  const rawNervousness = cfg.get<string>('nervousness', 'normal');
  const nervousness: Nervousness = isKnownNervousness(rawNervousness) ? rawNervousness : 'normal';

  const cooldownInspect = cfg.inspect<number>('cooldownMs');
  const ignoreInspect = cfg.inspect<number[]>('ignoreExitCodes');

  const raw: RawSettings = {
    nervousness,
    cooldownMs: cfg.get<number>('cooldownMs', 5000),
    cooldownMsExplicit:
      isExplicitlySet(cooldownInspect?.globalValue) ||
      isExplicitlySet(cooldownInspect?.workspaceValue) ||
      isExplicitlySet(cooldownInspect?.workspaceFolderValue),
    volume: cfg.get<number>('volume', 1),
    ignoreExitCodes: cfg.get<number[]>('ignoreExitCodes', [130]),
    ignoreExitCodesExplicit:
      isExplicitlySet(ignoreInspect?.globalValue) ||
      isExplicitlySet(ignoreInspect?.workspaceValue) ||
      isExplicitlySet(ignoreInspect?.workspaceFolderValue),
  };

  return resolveEffective(raw);
}
