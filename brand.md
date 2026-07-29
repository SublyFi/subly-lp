# Brand — Subly LP

_Status: active_ · Source of truth lives in `app/globals.css` ("Encrypted Bulletin" system). This file documents it for tooling; edit the CSS variables, not this file, to change the brand.

## Positioning

- Product: yield-funded x402 payments for AI agents on Solana.
- Tagline: **Use Now, Pay Never** — "Your yield pays your AI agent's API bills."
- Voice: editorial, technical, declarative. Short sentences. Mono uppercase kickers (`▌ Section`). No hype adjectives; numbers carry the argument (5–10% APY target, $0.01 calls, 86% stat).

## Palette (light-first, print-inspired)

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#f4f1ea` | Page background |
| `--paper-deep` | `#ece6d8` | Alternate section background |
| `--ink` | `#0b0a14` | Text, borders, dark sections |
| `--ink-muted` | `#5a5670` | Secondary text |
| `--rule` | `#b9b3a6` | Hairlines |
| `--subly` | `#5e17eb` | Brand purple, used boldly |
| `--subly-deep` / `--subly-soft` / `--subly-tint` / `--subly-glow` | `#3a0e9d` / `#8e6bff` / `#efe7ff` / `#c8b3ff` | Purple ramp (glow = accent on dark) |
| `--glow` | `#d9ff3a` | Terminal/live accent on dark sections |
| `--alert` / `--ok` | `#ff5a4c` / `#2bb673` | Signal colors |

## Typography

- Display: Fraunces (`.font-display`, optical sizing, black weights, tight leading).
- Serif accent: Instrument Serif (`.font-feature`) for taglines and accent spans.
- Mono: JetBrains Mono (`.font-mono`) for kickers, labels, code, stats labels.
- Sans body: Geist Sans.

## Motifs

- Square corners (`--radius: 0.125rem`), 1–2px ink borders, hard offset shadows (`.shadow-stamp`, `.shadow-stamp-subly`).
- Grid/crosshatch background utilities (`.gridlines`, `.gridlines-purple`, `.crosshatch`), blinking status dots (`.blink`).
- Dark sections use `bg-ink` with `--glow` and `--subly-glow` accents; terminal blocks are `bg-black` with traffic-light dots.
