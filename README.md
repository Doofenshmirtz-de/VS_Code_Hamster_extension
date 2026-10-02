# Hamster Error Sound

Eine kleine VS Code Extension mit Meme-Charakter: Sobald ein Terminal-Befehl
oder ein VS Code Task mit einem Fehler endet, stirbt der Hamster hörbar.
Der Sound stammt aus dem Java-Hamster-Modell.

## Installation

Die Extension wird als `.vsix` über GitHub-Releases verteilt. Voraussetzung ist,
dass der `code`-Befehl im Terminal verfügbar ist.

macOS / Linux:

```bash
curl -L https://github.com/Doofenshmirtz-de/VS_Code_Hamster_extension/releases/latest/download/hamster-error-sound.vsix -o /tmp/hamster.vsix
code --install-extension /tmp/hamster.vsix
```

Windows (PowerShell):

```powershell
Invoke-WebRequest -Uri https://github.com/Doofenshmirtz-de/VS_Code_Hamster_extension/releases/latest/download/hamster-error-sound.vsix -OutFile $env:TEMP\hamster.vsix
code --install-extension $env:TEMP\hamster.vsix
```

Falls `code` nicht gefunden wird: In VS Code `Cmd/Ctrl+Shift+P` öffnen und
„Shell Command: Install 'code' command in PATH" ausführen.

## Wann ertönt der Sound?

- Ein Terminal-Befehl endet mit einem Exit-Code ungleich `0`.
- Ein VS Code Task endet mit einem Exit-Code ungleich `0`.

Standardmäßig wird Exit-Code `130` (Prozess per `Ctrl+C` abgebrochen) ignoriert,
damit ein bewusst abgebrochener Prozess keinen Sound auslöst.

> Hinweis: Terminal-Erkennung setzt VS Codes **Shell Integration** voraus
> (Standard bei bash, zsh und PowerShell). Ohne Shell Integration gibt es kein
> Ereignis und damit keinen Sound.

## Einstellungen

| Einstellung | Typ | Standard | Beschreibung |
|---|---|---|---|
| `hamster.nervousness` | `off` \| `mild` \| `normal` \| `chaos` | `normal` | Wie nervig soll die Extension sein? |
| `hamster.cooldownMs` | Zahl | `5000` | Mindestabstand zwischen zwei Sounds (überschreibt das Preset, wenn explizit gesetzt). |
| `hamster.volume` | Zahl `0..1` | `1` | Lautstärke. Wirkt voll auf macOS/Linux; Windows nur an/aus. |
| `hamster.ignoreExitCodes` | Zahl[] | `[130]` | Exit-Codes, die keinen Sound auslösen (überschreibt das Preset, wenn explizit gesetzt). |

### Nervigkeits-Stufen

| Stufe | Quellen | Cooldown | `130` ignoriert | Parallele Fehler |
|---|---|---|---|---|
| `off` | – | – | – | – |
| `mild` | nur Tasks | 10 s | ja | unterdrückt |
| `normal` | Terminal + Tasks | 5 s | ja | unterdrückt |
| `chaos` | Terminal + Tasks | 0 s | nein | Sound pro Prozess |

`chaos` ist bewusst gnadenlos: Auch Befehle wie `grep`, `diff` oder `test`, die
mit Exit-Code `1` legitim „nichts gefunden / Unterschied / Bedingung falsch"
melden, lösen dann den Sound aus.

Zusätzlich gibt es den Befehl **Hamster: Sound jetzt abspielen**, um die
Wiedergabe unabhängig von den Regeln zu testen.

## Entwicklung

```bash
npm install
npm test          # Unit-Tests
```

Zum manuellen Testen: Ordner in VS Code öffnen und `F5` drücken. Es startet ein
Extension Development Host. Dort ein Terminal öffnen und z. B. `false` oder
`exit 1` ausführen.

VSIX bauen:

```bash
npx @vscode/vsce package
```

Ein Tag `v*` löst über GitHub Actions automatisch einen Release-Build aus, der
das `.vsix` ans Release hängt.

## Plattformen

| OS | Player |
|---|---|
| macOS | `afplay` |
| Windows | PowerShell `Media.SoundPlayer` (`powershell`, sonst `pwsh`) |
| Linux | `paplay`, dann `aplay`, dann `ffplay` |

## Lizenz

MIT, siehe [LICENSE](LICENSE).

Der Sound `media/death.wav` stammt aus dem Java-Hamster-Modell von Dietrich Boles
und steht unter BSD-3-Clause. Details in
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
