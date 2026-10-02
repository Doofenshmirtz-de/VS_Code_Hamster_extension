# Changelog

Alle nennenswerten Änderungen an dieser Extension.

## 0.1.0

- Erste Version.
- Sound bei fehlgeschlagenem Terminal-Befehl (`onDidEndTerminalShellExecution`).
- Sound bei fehlgeschlagenem VS Code Task (`onDidEndTaskProcess`).
- Nervigkeits-Stufen `off`, `mild`, `normal`, `chaos`.
- Cooldown, Lautstärke und Ignore-Exit-Codes konfigurierbar.
- Audio-Wiedergabe über `afplay` (macOS), PowerShell `SoundPlayer` (Windows)
  und `paplay`/`aplay`/`ffplay` (Linux).
