import * as assert from 'assert';
import { strategyForPlatform } from '../audio/player';
import { macOSStrategy } from '../audio/players/macos';
import { windowsStrategy } from '../audio/players/windows';
import { linuxStrategy } from '../audio/players/linux';
import { clampVolume } from '../audio/players/types';

describe('audio strategies', () => {
  it('wählt die richtige Strategie je Plattform', () => {
    assert.strictEqual(strategyForPlatform('darwin'), macOSStrategy);
    assert.strictEqual(strategyForPlatform('win32'), windowsStrategy);
    assert.strictEqual(strategyForPlatform('linux'), linuxStrategy);
    assert.strictEqual(strategyForPlatform('freebsd'), undefined);
  });

  it('macOS nutzt afplay mit Lautstärke', () => {
    const [command] = macOSStrategy.buildCommands('/tmp/death.wav', 0.5);
    assert.strictEqual(command.command, 'afplay');
    assert.deepStrictEqual(command.args, ['-v', '0.50', '/tmp/death.wav']);
  });

  it('Windows nutzt PowerShell und escaped einfache Anführungszeichen', () => {
    const commands = windowsStrategy.buildCommands("C:\\Users\\O'Brien\\death.wav", 1);
    assert.strictEqual(commands[0].command, 'powershell');
    const script = commands[0].args[commands[0].args.length - 1];
    assert.ok(script.includes("O''Brien"));
  });

  it('Linux probiert paplay, dann aplay, dann ffplay', () => {
    const commands = linuxStrategy.buildCommands('/tmp/death.wav', 0.5);
    assert.deepStrictEqual(
      commands.map((c) => c.command),
      ['paplay', 'aplay', 'ffplay']
    );
    assert.ok(commands[0].args.includes('32768'));
    assert.ok(commands[2].args.includes('50'));
  });

  it('klammert die Lautstärke auf 0..1', () => {
    assert.strictEqual(clampVolume(-1), 0);
    assert.strictEqual(clampVolume(2), 1);
    assert.strictEqual(clampVolume(Number.NaN), 1);
  });
});
