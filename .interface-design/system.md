Direction and feel
- The product should feel like a disciplined training floor: direct, dark, structured, and branded by a single strong red accent.
- Navigation and key actions should read as anchored utility controls, not decorative marketing elements.
- Copy and layout should emphasize progress, clarity, and restraint over hype.

Depth strategy
- Use borders-only as the primary depth system.
- Base canvas: `bg-background`.
- Raised surfaces: `bg-surface` and `bg-surface-light` with low-contrast gray borders.
- Reserve red borders and fills for active, primary, or branded emphasis only.

Spacing base unit
- Use a 4px base spacing grid.
- Primary nav controls should use symmetric vertical rhythm and consistent horizontal gaps in 12px or 16px increments.
- Larger grouped sections should step in 24px, 32px, and 48px intervals.

Key component patterns
- Landing sections: dark canvas, bordered section separation, one accent color, strong uppercase headings, restrained supporting copy.
- Hero: split composition with a strong headline column and a compact information panel; avoid heavy media payloads when static structure can carry the message.
- Testimonial cards: use proof-oriented identity chips and labeled result rows instead of placeholder imagery.
- Footer: use actionable support blocks and real expandable legal summaries; avoid fake affordances and placeholders.
- Navbar: center the logo on its own column, keep left/right groups visually balanced, and give authenticated tabs equal spacing and equal control widths.
- Admin roster screens: build them as stacked surfaces with a summary header, one control rail, then a roster/table surface. Use identity chips, restrained status pills, and bordered action buttons instead of plain text links.
- Admin create forms: treat create/edit flows as full in-module pages, with a clear return action, grouped field sections, and responsive two-column layouts that collapse cleanly to one column on mobile.
- Admin programming screens: for routines and plans, mirror the roster pattern but swap member identity for training metadata chips, workload stats, and schedule signals. Keep creation flows as separate in-module pages, not modal overlays.
- Nutrition modules: keep the same borders-only shell as routines, but use review timing, macro load, and assignment state as the primary signals. User nutrition screens should open with a summary surface, then stack exportable daily macros, distribution, meals, and support notes in clearly separated bordered sections.
- Analytics modules: use the same admin shell, lead with four KPI cards sourced from live module data, and keep charts inside bordered utility surfaces. Prefer real Lucide icons, one primary red data series, and tables that expose both per-plan breakdown and the current monthly total.
