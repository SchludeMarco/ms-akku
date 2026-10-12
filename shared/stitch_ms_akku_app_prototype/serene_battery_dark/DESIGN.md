---
name: Serene Battery Dark
colors:
  surface: '#0d1518'
  surface-dim: '#0d1518'
  surface-bright: '#323a3e'
  surface-container-lowest: '#070f12'
  surface-container-low: '#151d20'
  surface-container: '#192124'
  surface-container-high: '#232b2e'
  surface-container-highest: '#2e3639'
  on-surface: '#dbe4e8'
  on-surface-variant: '#bacac5'
  inverse-surface: '#dbe4e8'
  inverse-on-surface: '#2a3235'
  outline: '#859490'
  outline-variant: '#3c4a46'
  surface-tint: '#3cddc7'
  primary: '#57f1db'
  on-primary: '#003731'
  primary-container: '#2dd4bf'
  on-primary-container: '#00574d'
  inverse-primary: '#006b5f'
  secondary: '#4fdbc8'
  on-secondary: '#003731'
  secondary-container: '#04b4a2'
  on-secondary-container: '#003f38'
  tertiary: '#afe0ff'
  on-tertiary: '#00354a'
  tertiary-container: '#5ec9ff'
  on-tertiary-container: '#005371'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#62fae3'
  primary-fixed-dim: '#3cddc7'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005047'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#0d1518'
  on-background: '#dbe4e8'
  surface-variant: '#2e3639'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 42px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1.25rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 2rem
  space-xl: 3rem
---

## Brand & Style

This design system is specifically engineered for individuals managing Multiple Sclerosis (MS), where visual fatigue, cognitive overload, optic neuritis history, and motor tremors require an environment of absolute visual calm and effortless interaction. The interface acts as a restorative shelter rather than a demanding digital cockpit.

The visual style blends refined **Minimalism** with organic **Tonal Layering** and subtle tactile grounding. Rather than relying on stark, eye-straining pure blacks (#000000) or blaring pure whites (#FFFFFF), the palette uses deeply saturated petrol-slate foundations combined with luminous sage-tinted off-whites. High optical clarity is preserved without blinding luminance spikes. Component interaction centers around generous physical touch targets, deliberate spatial pacing, and soft, non-dazzling diffuse radiance to signal system status and energy preservation.

## Colors

The palette is tuned to mitigate glare, optical haloing, and sensory stress while maintaining strict WCAG AAA contrast ratios for vital informational thresholds:

- **Canvas & Background (`#0d1518` / `#0f171c`):** Deep oceanic night-petrol that eliminates pixel glare while avoiding the deadening contrast of true black.
- **Surface Tier 1 (`#152228`):** Base structural level for sections, persistent sidebars, and structural panels.
- **Surface Container (`#1c2b33`):** Elevated visual planes for cards, list modules, and input groupings.
- **Surface Container High (`#243741`):** Floating elements, active popovers, and elevated modal panels.
- **Primary Teal (`#2dd4bf`):** Soft, soothing sea-glass emerald used for principal calls-to-action, active indicators, and critical progress milestones.
- **Secondary Teal (`#14b8a6`):** Deeper sage-petrol anchor for interactive hover states, supportive iconography, and secondary buttons.
- **Border / Outline (`#22373e`):** Low-contrast structural framing that guides visual separation without creating harsh gridlines.
- **Text Primary (`#e6f1f0`):** Warm frosted mint off-white providing readable, anti-glare contrast across all petrol surfaces.
- **Text Secondary / Muted (`#9ab0ad`):** Desaturated sage-grey designed for secondary labels, metadata, and non-critical guidance.
- **Status Amber (`#f6ad55`) & Calming Rose (`#f87171`):** Muted, non-aggressive alerting tones used exclusively for essential bio-metric thresholds and energy warnings.

## Typography

Plus Jakarta Sans is utilized across all typographic roles. Its open apertures, generous x-height, and soft curvature reduce visual strain and prevent character misrecognition during bouts of cognitive fatigue or temporary visual blurring. 

Line heights remain intentionally spacious (between 1.5x and 1.6x body scale) to ensure effortless horizontal reading tracking across lines. Font weights stay anchored between Medium (500) and Bold (700) for interactive elements, deliberately avoiding hair-thin optical weights (100–300) that disappear on dark petrol surfaces.

## Layout & Spacing

The layout model implements a flexible 12-column grid on desktop and tablet, resolving down to a single or dual-column structure on mobile devices. 

Ample breathing room is prioritized over data density. Margins and gutters expand gracefully to prevent accidental touches by users experiencing motor tremor or spasticity. Interactive components maintain a mandatory minimum touch envelope of 48×48px, surrounded by at least `space-sm` (12px) of clear spatial margin to eliminate overlapping gestures.

## Elevation & Depth

Spatial hierarchy is defined primarily via **Tonal Layering** rather than sharp shadows or artificial perspective. Elements gain prominence by stepping upward across lighter, warmer petrol containers: `#0d1518` (Canvas) → `#152228` (Surface) → `#1c2b33` (Card/Container) → `#243741` (High Container/Active State).

To reinforce depth without introducing harsh edges:
- **Low-Contrast Outlines:** Every container utilizes a 1px soft border colored `#22373e`, maintaining separation without eye-jarring gridlines.
- **Ambient Teal Glow:** Floating controls or focused interactive elements deploy a low-opacity diffused glow (`0 8px 32px -4px rgba(45, 212, 191, 0.12)`) in place of harsh dark drop shadows. This simulates a soft, calming backlight.

## Shapes

The design system enforces organic, protective corners through an expanded curvature baseline. All card enclosures, structural containers, and primary surfaces are styled with `rounded-2xl` (1rem to 1.5rem / 16px to 24px). 

Sharp 90-degree corners are completely removed from interactive surfaces to foster a gentle, organic interface that feels reassuring to the touch. Pills and fully rounded geometries are reserved for status chips and battery/energy badges.

## Components

### Buttons
- **Primary:** Solid `#2dd4bf` fill with deep petrol text (`#0d1518`, font weight 600). Minimum height of 52px. Border radius `rounded-2xl` (16px). Active states do not flash white; they adopt a warm soft glow (`rgba(45, 212, 191, 0.25)`).
- **Secondary / Ghost:** Container background `#1c2b33`, 1px border in `#22373e`, text in `#e6f1f0`. Hover/Focus transitions background gently to `#243741` with a `#2dd4bf` border accent.

### Chips & Battery Badges
- Compact indicators showing MS energy reserves ("Akku"), fatigue scores, or environmental temperature warnings.
- Fully rounded pill shape (`rounded-full`), padded with `space-xs` vertically and `space-md` horizontally.
- Background uses `#152228` with dynamic status-tinted borders (e.g., `#2dd4bf` for stabilized energy; muted amber for depletion).

### Lists & Selection Rows
- Padded structural cards rather than simple hairline dividers.
- Row heights are relaxed (minimum 64px) with generous horizontal padding (`space-md`), featuring a subtle `#1c2b33` background with a hover shift to `#243741`.
- Chevron and action icons are enlarged (24px) in muted sage (`#9ab0ad`).

### Checkboxes & Radio Controls
- Target enclosures are explicitly enlarged (minimum 28×28px physical box inside a 48×48px touch zone).
- Unselected state uses `#1c2b33` with `#22373e` border.
- Selected state fills with `#14b8a6` featuring an off-white `#e6f1f0` checkmark indicator.

### Input Fields
- Heavy focus on legibility and reduced strain. Background `#152228`, border 1.5px `#22373e`, height 56px, corner radius `rounded-xl`.
- Floating labels in `#9ab0ad` that scale down to 12px without disappearing.
- Focus state brings a clear, non-blinding teal border (`#2dd4bf`) with an accompanying 4px ambient focus glow ring (`rgba(45, 212, 191, 0.15)`).

### Energy Metric Cards ("Akku-Tracker")
- Large rounded surface cards (`rounded-2xl`, `#1c2b33`) featuring horizontal bar or arc meters filled with `#2dd4bf`.
- Visual cues prioritize soft gradients between sage and teal rather than stark, warning-heavy red indicators to keep psychological stress minimal.