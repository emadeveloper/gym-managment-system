# Interface System

## Direction & Feel
- Product context: panel de entrenamiento personal para usuarios de gimnasio.
- Tone: oscuro, enérgico, directo y orientado a acción diaria.
- Signature: cards de estado con lenguaje de progreso (hoy toca, badge por permanencia, estado de cuenta y plan vigente).

## Palette
- Base background: `--color-background` (`#111`)
- Card surface: `--color-surface` (`#222`)
- Border: `--color-border` (`#333`)
- Brand accent: `--color-primary` (`#cc0000`)
- Accent variants: `--color-primary-light` (`#ff3333`), `--color-primary-dark` (`#990000`)

## Depth Strategy
- Primaria: `borders-only` con variaciones de opacidad.
- Sombras: mínimas y solo heredadas de componente base.
- Jerarquía por contraste de superficie (`bg-surface`, `bg-primary/10-25`, `bg-primary-dark/20-35`).

## Spacing Base
- Base unit: `4px`.
- Card padding: `p-4` a `p-6` según breakpoint.
- Grid gaps:
  - cards rápidas: `gap-4`
  - grid principal dashboard: `gap-6 lg:gap-8`

## Key Component Patterns
- Welcome block:
  - Título `Bienvenido {nombre}`.
  - Subtexto operativo de inicio (`Hoy toca ...` o fallback sin rutina).
- Quick insight cards (fila superior):
  - 3 cards: rutina asignada, plan nutricional, objetivo actual.
  - Icono Lucide contextual a la derecha del heading.
  - Estado/fallback explícito cuando falta data.
- Membership progress card:
  - Badges por antigüedad: `Beginner`, `Intermediate`, `Expert`, `Master`.
  - Milestones celebrables: `3`, `6`, `12` meses.
  - Sin barra de progreso visual.
  - Bloques de detalle: `Estado de cuenta` + `Plan vigente`.
  - Paleta fija en rojos del sistema para consistencia.
