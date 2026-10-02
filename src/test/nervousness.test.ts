import * as assert from 'assert';
import { resolveEffective, RawSettings } from '../core/nervousness';

function raw(partial: Partial<RawSettings>): RawSettings {
  return {
    nervousness: 'normal',
    cooldownMs: 5000,
    cooldownMsExplicit: false,
    volume: 1,
    ignoreExitCodes: [130],
    ignoreExitCodesExplicit: false,
    ...partial,
  };
}

describe('nervousness presets', () => {
  it('normal: beide Quellen, 5s, ignoriert 130, single', () => {
    const config = resolveEffective(raw({ nervousness: 'normal' }));
    assert.deepStrictEqual(config.sources, ['terminal', 'task']);
    assert.strictEqual(config.cooldownMs, 5000);
    assert.deepStrictEqual(config.ignoreExitCodes, [130]);
    assert.strictEqual(config.parallel, 'single');
    assert.strictEqual(config.enabled, true);
  });

  it('mild: nur Tasks, 10s', () => {
    const config = resolveEffective(raw({ nervousness: 'mild' }));
    assert.deepStrictEqual(config.sources, ['task']);
    assert.strictEqual(config.cooldownMs, 10_000);
  });

  it('chaos: kein Cooldown, keine Ignore-Codes, each', () => {
    const config = resolveEffective(raw({ nervousness: 'chaos' }));
    assert.strictEqual(config.cooldownMs, 0);
    assert.deepStrictEqual(config.ignoreExitCodes, []);
    assert.strictEqual(config.parallel, 'each');
  });

  it('off: deaktiviert', () => {
    const config = resolveEffective(raw({ nervousness: 'off' }));
    assert.strictEqual(config.enabled, false);
    assert.deepStrictEqual(config.sources, []);
  });

  it('explizites cooldownMs überschreibt das Preset', () => {
    const config = resolveEffective(raw({ nervousness: 'mild', cooldownMs: 1234, cooldownMsExplicit: true }));
    assert.strictEqual(config.cooldownMs, 1234);
  });

  it('explizite ignoreExitCodes überschreiben das Preset', () => {
    const config = resolveEffective(
      raw({ nervousness: 'chaos', ignoreExitCodes: [130, 1], ignoreExitCodesExplicit: true })
    );
    assert.deepStrictEqual(config.ignoreExitCodes, [130, 1]);
  });
});
