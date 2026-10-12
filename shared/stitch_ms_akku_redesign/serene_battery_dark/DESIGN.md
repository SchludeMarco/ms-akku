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
  surface-tint: '#3bddc7'
  primary: '#d6fff6'
  on-primary: '#003731'
  primary-container: '#57f1db'
  on-primary-container: '#006b60'
  inverse-primary: '#006b5f'
  secondary: '#44e2cd'
  on-secondary: '#003731'
  secondary-container: '#03c6b2'
  on-secondary-container: '#004d44'
  tertiary: '#fff4ee'
  on-tertiary: '#4c2700'
  tertiary-container: '#ffd1ad'
  on-tertiary-container: '#904e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#62fae3'
  primary-fixed-dim: '#3bddc7'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005047'
  secondary-fixed: '#62fae3'
  secondary-fixed-dim: '#3cddc7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#ffdcc2'
  tertiary-fixed-dim: '#ffb77a'
  on-tertiary-fixed: '#2e1500'
  on-tertiary-fixed-variant: '#6d3a00'
  background: '#0d1518'
  on-background: '#dbe4e8'
  surface-variant: '#2e3639'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
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
  body-md-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 26px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.25rem
  margin-mobile: 1rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is engineered specifically for individuals living with Multiple Sclerosis (MS) who track, manage, and conserve daily physical and cognitive energy reserves. The experience is rooted in psychological safety, calmness, and extreme accessibility under acute symptoms such as severe fatigue, optic neuritis, reduced visual contrast sensitivity, and motor tremor.

### Design Movement & Aesthetic
The system unites **Calm Digital Ergonomics** with **Tactile Softness**:
- **Zero Sensory Overload**: High optical clarity without aggressive contrasts, harsh glare, or sudden shifts. Dark surfaces are deep ocean slate rather than pure black `#000000`, mitigating haloing, glare, and visual strain.
- **Cognitive Relief**: The UI avoids alarming states. Low energy levels are communicated with soothing cool tones rather than punitive, panic-inducing bright reds.
- **Motor Empathy**: Spacing and hit volumes strictly anticipate intention tremors and motor imprecision through generous tap boundaries, physical separation, and tactile activation feedback.

## Colors

The color architecture is built around emotional reassurance and strict contrast standards (WCAG 2.1 AAA for core body text and interactive states).

### Default Palette: Serene Dark
- **Base Canvas**: `#0D1518` (deep maritime obsidian)
- **Tonal Elevation Surfaces**:
  - Surface Tier 1 (Base Cards / Sections): `#151D20`
  - Surface Tier 2 (Interactive Cards / List Items): `#192124`
  - Surface Tier 3 (Modals / Overlays / Elevated Containers): `#232B2E`
  - Surface Tier 4 (Floating Elements / Prominent Indicators): `#2E3639`
- **Text & Foreground**:
  - Primary Content: `#DBE4E8`
  - Secondary / Supportive Content: `#BACAC5`
- **Structural Dividers & Outlines**: `#3C4A46`
- **Primary Accent & Action**:
  - Focus Ring & Accent: `#57F1DB`
  - Interactive Surfaces (Primary CTA): `#2DD4BF` with dedicated high-contrast label color `#003731`
- **Energy State Spectrum** (Intentionally non-alarmist):
  - High Energy: `#2DD4BF` (Radiant Teal)
  - Medium Energy: `#FEA047` (Warm Soft Amber)
  - Low Energy / Depleted: `#AFE0FF` (Cool Serene Ice Blue — non-punitive, signaling rest)
- **Error / Alert**: `#FFB4AB` (Muted soft coral, readable against dark surfaces without inducing stress)

### Alternate Palette: Pastell (Sage Calm)
- **Canvas**: `#E9F0EC`
- **Surfaces (Tier 1–4)**: `#E2EBE6`, `#DCE7E1`, `#D3E0D9`, `#C9D8D0`
- **Text**: `#1D2B29` (Primary), `#44534F` (Secondary)
- **Borders & Dividers**: `#AFC0B8`
- **Primary CTA**: `#245F59` (Text: `#FFFFFF`)
- **Energy States**: High: `#63BBAD`, Medium: `#EBA765`, Low: `#8FB4E3`

## Typography

The typography is built using **Plus Jakarta Sans** for maximum legibility and friendly geometry.

### Readability & Truncation Rules
- **No Truncation Policy**: Text truncation (`text-overflow: ellipsis`, `...`) is strictly prohibited. Labels, symptoms, notes, and values must wrap naturally into multiline containers. Containers and cards dynamically expand downward.
- **Minimum Font Sizes**: Body copy must never drop below `16px`. Secondary, caption, or helper text must never drop below `14px`.
- **Vertical Air**: Line heights are extended (`1.5` to `1.6x` font size) to reduce reading fatigue and prevent visual line jumping during tracking episodes.

## Layout & Spacing

Layouts prioritize single-column focus, vertical progression, and thumb-zone ergonomics.

### Motor Accessibility Rules
- **Minimum Touch Target**: Interactive elements must reserve a minimum hit box of `48px × 48px`.
- **Target Clearance**: Interactive elements must maintain at least `8px` (`0.5rem` / `space-xs`) of clear separation from adjacent interactive surfaces to prevent unintended activations caused by tremor.
- **Scroll Padding**: Generous bottom padding (`96px`) ensures content is never obscured by the elevated navigation bar.

## Elevation & Depth

To avoid optical noise, this system relies on **Tonal Layers** reinforced by subtle low-contrast borders and atmospheric glows, explicitly rejecting sharp, aggressive drop shadows.

### Layering Strategy
1. **Background**: Lowest tier (`#0D1518`), setting the restful environment.
2. **Surfaces**: Content cards (`#151D20` to `#192124`) receive an inner structural clarity via `1px solid #3C4A46` borders instead of dark shadows.
3. **Elevated Overlays**: Modals and bottom sheets sit on `#232B2E` with a soft backdrop wash (`rgba(13, 21, 24, 0.75)` with `8px` backdrop blur).
4. **Primary Glow**: The central "Erfassen" (Log) action and focal elements use a tranquil cyan aura (`box-shadow: 0 4px 20px rgba(45, 212, 191, 0.25)`), providing clear visual priority without glare.

## Shapes

The shape hierarchy employs soothing geometry with corner radii calibrated strictly between `12px` and `16px` for cards and content groups, and full pill radii for active buttons and status badges.

- **Cards & Sheets**: `rounded-lg` (`16px`) creates friendly, non-threatening visual boundaries.
- **Inputs & Interactive Cards**: `rounded` (`12px`) provides clear separation from content containers.
- **Pills & Floating Action Buttons**: Fully rounded (`9999px`) for high-priority interactive touchpoints.

## Components

### Header (App Bar)
- Height is fixed at `64px` with horizontal margin of `16px`.
- Left/Right utility actions (e.g., Settings, Back) have a minimum hit target of `48px × 48px`, centered with `24px` icons.
- Title uses `headline-md` (`20px`) with high-contrast text (`#DBE4E8`).

### Navigation: 4-Tab Bottom Bar with Central Action
- Bar height is `72px`, sitting on Surface Tier 3 (`#232B2E`) with a top border of `1px solid #3C4A46`.
- 4 destination tabs (e.g., Tagebuch, Verlauf, Energie-Tipps, Profil) are distributed with dedicated `48px × 48px` touch targets.
- **Central Action Button ("Erfassen")**:
  - Size: `56px × 56px` circular floating button resting slightly elevated above the bar.
  - Background: `#2DD4BF` with text/icon `#003731`.
  - Ambient glow: `0 4px 20px rgba(45, 212, 191, 0.3)`.
  - Active/Pressed: scaled down to `96%` with expanded target area.

### Buttons
- **Primary Button**: Background `#2DD4BF`, text `#003731` (`16px`, weight 600). Minimum height `52px`, `rounded-full` or `rounded-lg` (`14px`). Subtle glow.
- **Secondary Button**: Surface `#192124`, border `1.5px solid #3C4A46`, text `#DBE4E8`. Minimum height `52px`.
- **Touch Margins**: Always preserve `8px` minimum distance between sibling buttons.

### Chips & Energy Selectors
- Large, easy-to-hit chips with minimum height `48px` and horizontal padding of `16px`.
- Selected states use the designated energy tint border (`2px`) and matching subtle tinted surface background (`12%` opacity).
- Unselected chips use `#192124` with border `#3C4A46` and secondary text `#BACAC5`.

### Cards & Expandable Lists
- Card padding is set to `16px` (`space-md`).
- Surfaces use Tier 1 (`#151D20`) or Tier 2 (`#192124`) with `1px solid #3C4A46`.
- Text inside cards never truncates; multiline descriptions flow naturally with container auto-height.

### Inputs & Sliders
- Input fields have minimum height of `52px`, background `#151D20`, border `1.5px solid #3C4A46`, text `#DBE4E8`.
- Focus state activates an outline in `#57F1DB` (`2px`).
- Energy level sliders feature a `36px` circular draggable thumb with an invisible `52px` tap zone for effortless tremor-friendly operation.