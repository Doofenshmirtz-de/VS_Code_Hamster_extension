import * as assert from 'assert';
import { createDecisionState, shouldPlay } from '../core/decision';
import { EffectiveConfig } from '../core/nervousness';

function config(partial: Partial<EffectiveConfig>): EffectiveConfig {
  return {
    nervousness: 'normal',
    enabled: true,
    sources: ['terminal', 'task'],
    cooldownMs: 5000,
    volume: 1,
    ignoreExitCodes: [130],
    parallel: 'single',
    ...partial,
  };
}

describe('shouldPlay', () => {
  it('spielt bei Exit-Code != 0', () => {
    const result = shouldPlay({ source: 'terminal', exitCode: 1 }, config({}), createDecisionState(), 1000);
    assert.strictEqual(result.play, true);
  });

  it('spielt nicht bei Exit-Code 0', () => {
    const result = shouldPlay({ source: 'terminal', exitCode: 0 }, config({}), createDecisionState(), 1000);
    assert.strictEqual(result.play, false);
  });

  it('spielt nicht ohne Exit-Code', () => {
    const result = shouldPlay({ source: 'terminal', exitCode: undefined }, config({}), createDecisionState(), 1000);
    assert.strictEqual(result.play, false);
  });

  it('ignoriert Ctrl+C (130)', () => {
    const result = shouldPlay({ source: 'terminal', exitCode: 130 }, config({}), createDecisionState(), 1000);
    assert.strictEqual(result.play, false);
  });

  it('ignoriert deaktivierte Quellen (mild ohne terminal)', () => {
    const result = shouldPlay(
      { source: 'terminal', exitCode: 1 },
      config({ sources: ['task'] }),
      createDecisionState(),
      1000
    );
    assert.strictEqual(result.play, false);
  });

  it('ist aus, wenn disabled', () => {
    const result = shouldPlay({ source: 'task', exitCode: 1 }, config({ enabled: false }), createDecisionState(), 1000);
    assert.strictEqual(result.play, false);
  });

  it('unterdrückt innerhalb des Cooldowns', () => {
    const state = createDecisionState();
    state.lastPlayedAt = 1000;
    const result = shouldPlay({ source: 'terminal', exitCode: 1 }, config({}), state, 3000);
    assert.strictEqual(result.play, false);
  });

  it('spielt nach abgelaufenem Cooldown wieder', () => {
    const state = createDecisionState();
    state.lastPlayedAt = 1000;
    const result = shouldPlay({ source: 'terminal', exitCode: 1 }, config({}), state, 7000);
    assert.strictEqual(result.play, true);
  });

  it('single: unterdrückt, während ein Sound läuft', () => {
    const state = createDecisionState();
    state.playing = true;
    const result = shouldPlay(
      { source: 'terminal', exitCode: 1 },
      config({ cooldownMs: 0, parallel: 'single' }),
      state,
      1000
    );
    assert.strictEqual(result.play, false);
  });

  it('chaos (each): spielt auch, während ein Sound läuft', () => {
    const state = createDecisionState();
    state.playing = true;
    const result = shouldPlay(
      { source: 'terminal', exitCode: 1 },
      config({ cooldownMs: 0, parallel: 'each', ignoreExitCodes: [] }),
      state,
      1000
    );
    assert.strictEqual(result.play, true);
  });
});
