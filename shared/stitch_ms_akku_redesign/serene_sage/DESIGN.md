---
name: Serene Sage
colors:
  surface: '#f4fbf7'
  surface-dim: '#d5dcd8'
  surface-bright: '#f4fbf7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef5f1'
  surface-container: '#e8efeb'
  surface-container-high: '#e3eae6'
  surface-container-highest: '#dde4e0'
  on-surface: '#161d1b'
  on-surface-variant: '#404947'
  inverse-surface: '#2b322f'
  inverse-on-surface: '#ebf2ee'
  outline: '#707977'
  outline-variant: '#bfc8c6'
  surface-tint: '#2e6861'
  primary: '#014742'
  on-primary: '#ffffff'
  primary-container: '#245f59'
  on-primary-container: '#9cd7cf'
  inverse-primary: '#97d1ca'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#9af3e3'
  on-secondary-container: '#007165'
  tertiary: '#5f3400'
  on-tertiary: '#ffffff'
  tertiary-container: '#7d4a0f'
  on-tertiary-container: '#ffbf83'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b3eee6'
  primary-fixed-dim: '#97d1ca'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#0f4f4a'
  secondary-fixed: '#9af3e3'
  secondary-fixed-dim: '#7ed6c7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#ffdcbf'
  tertiary-fixed-dim: '#feb874'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6a3b00'
  background: '#f4fbf7'
  on-background: '#161d1b'
  surface-variant: '#dde4e0'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is tailored for daily fatigue tracking and energy pacing in chronic illness care (specifically Multiple Sclerosis). The emotional atmosphere is calm, restorative, low-sensory, and reassuring.

Visual characteristics:
- **Design Movement:** Organic Soft-Minimalism with Tactile Tonality.
- **Atmospheric Quality:** Glare-free light mode. Pure white (#FFFFFF) is prohibited on layout surfaces to prevent photo-sensitivity flares, optical vibration, and mental exhaustion.
- **Cognitive Ergonomics:** Calming sage backgrounds establish visual stillness. Functional feedback relies on gentle tonal transitions rather than stark, alarming high-contrast shifts. Status representations avoid aggressive warning metaphors; low battery or energy reserves use a soothing pastel blue instead of standard alert red.

## Colors

The palette uses a low-luminance sage base with muted semantic pastels to eliminate visual fatigue while maintaining accessible legibility.

### Surface Tones
- **Base Canvas (surface):** `#E9F0EC` (Warm Sage Canvas, replacing harsh white).
- **Surface Level 1 (lowest elevation):** `#E2EBE6`
- **Surface Level 2 (standard cards):** `#DCE7E1`
- **Surface Level 3 (elevated cards/active rows):** `#D3E0D9`
- **Surface Level 4 (floating panels/sheets):** `#C9D8D0`

### Typography & Linework
- **Text Primary:** `#1D2B29` (Deep Forest Slate, optimal contrast against sage without harsh black).
- **Text Secondary / Muted:** `#44534F` (Soft Sage Charcoal).
- **Outlines & Dividers:** `#AFC0B8` (Gentle Sage Contour).

### Action & Functional Pastels
- **Primary Action (buttons, interactive anchors):** `#245F59` (Deep Sea Pine) with `#FFFFFF` text.
- **Pastel Teal (selected states, accent surfaces):** `#63BBAD` with dark ink `#00201C`.
- **Destructive / Error:** `#9E3A34` (Muted Redwood, non-jarring alert).

### Energy Levels (Pacing Paradigm)
- **High Energy (80%–100%):** `#63BBAD` (Pastel Teal) with `#00201C` text.
- **Medium Energy (40%–79%):** `#EBA765` (Warm Apricot) with `#331A00` text.
- **Low Energy (0%–39%):** `#8FB4E3` (Pastel Hydrangea Blue) with `#0A1E33` text. *Red is explicitly avoided to remove guilt or psychological anxiety around exhaustion.*

## Typography

The design system utilizes **Plus Jakarta Sans** across all roles for its balanced geometry, wide aperture, and friendly roundness, which enhances readability during episodes of visual fatigue and cognitive brain fog.

Implementation rules:
- **No Truncation:** Text truncation (`text-overflow: ellipsis`) is strictly forbidden on titles, metrics, instructions, and symptom logs. Text must wrap cleanly onto subsequent lines.
- **Generous Line Height:** Body and label text use open leading (1.5x minimum) to prevent tracking fatigue across lines.
- **Weight Restraint:** Weights are constrained to 400 (Regular), 500 (Medium), 600 (Semi-Bold), and 700 (Bold). Ultra-light and black weights are excluded to avoid eye strain.

## Layout & Spacing

The layout centers around breathable, low-density card groupings arranged in a single-column flow on mobile viewports and a max 2-column modular grid on larger screens.

- **Interaction Zones & Touch Targets:** Every interactive control has a strict physical target area of at least **48x48px**. 
- **Separation Safety:** A minimum gap of **8px (`space-xs`)** is maintained between adjacent tap targets to prevent accidental activations during tremors or low motor control.
- **Rhythm & Grid:** Standard margin is `1.25rem` (20px) on mobile viewports and scales to `2rem` (32px) on desktop. Vertical rhythm defaults to `space-md` (16px) between related cards and `space-xl` (32px) between daily tracking clusters.

## Elevation & Depth

Spatial layering relies on **tonal stepping** and **soft structural outlines** rather than drop shadows:

- **Surface Progression:**
  - Base canvas: `#E9F0EC`
  - Grouped cards: `#E2EBE6` or `#DCE7E1`
  - Floating dialogue sheets or modal overlays: `#C9D8D0`
- **Borders over Shadows:** Deep black or high-offset shadows are replaced by a 1px solid border using `#AFC0B8`. This creates tactile grouping without high-frequency visual noise.
- **Atmospheric Rest:** If a floating action element requires distinct separation, use an ultra-diffused ambient shadow: `0 8px 24px -4px rgba(29, 43, 41, 0.07)`. No sharp directional cast shadows are permitted.

## Shapes

The form vocabulary uses rounded geometries to reinforce physical comfort and approachable ergonomics:

- **Cards & Containers:** `12px` to `16px` border-radius (`rounded-lg`), softening harsh rectangular grids.
- **Action Buttons & Inputs:** Uniform `16px` border-radius for an inviting, pill-like handheld feel.
- **Energy Chips & Badges:** Full pill-shape (`9999px`) to immediately distinguish tags and contextual meters from structural cards.

## Components

### Buttons
- **Primary Action Button:**
  - Background: `#245F59`
  - Text: `#FFFFFF`
  - Min Height: `48px`, Min Width: `48px`
  - Border-Radius: `16px`
  - Padding: `0 24px`
  - Focus Ring: `3px solid #63BBAD` with `2px` offset on `#E9F0EC`
- **Secondary Action Button:**
  - Background: `#DCE7E1`
  - Border: `1px solid #AFC0B8`
  - Text: `#1D2B29`
  - Border-Radius: `16px`
- **Destructive Button:**
  - Background: `#9E3A34`
  - Text: `#FFFFFF`
  - Border-Radius: `16px`

### Chips & Energy Status Pills
- **Geometry:** Height `36px` to `40px`, pill-shaped (`rounded-full`), padding `0 16px`.
- **Variants:**
  - *High Energy:* Background `#63BBAD`, text `#00201C`.
  - *Medium Energy:* Background `#EBA765`, text `#331A00`.
  - *Low Energy:* Background `#8FB4E3`, text `#0A1E33`.
  - *Neutral Filter:* Background `#DCE7E1`, border `1px solid #AFC0B8`, text `#1D2B29`.

### Cards
- Standard background: `#DCE7E1` with a `1px solid #AFC0B8` border.
- Border-Radius: `16px`.
- Internal padding: `20px` (`space-lg` responsive).
- Content structure: Large readable titles, nested metadata in `#44534F`, with unclipped body text.

### Form Inputs
- Background: `#E2EBE6`
- Border: `1px solid #AFC0B8`
- Min Height: `48px`
- Border-Radius: `16px`
- Text: `#1D2B29`, Placeholder: `#44534F`
- Active Focus: Border `#245F59` (2px solid), no harsh glow.

### Checkboxes & Radios
- Size: `24x24px` within a bounded hit-area of `48x48px`.
- Border: `2px solid #245F59`.
- Checked State: Fill `#245F59` with `#FFFFFF` checkmark or radio dot.
- Separation: Minimum `8px` between selection items.

### Battery / Energy Gauge
- Track: `#D3E0D9` with `8px` radius.
- Height: `20px` minimum for immediate optical clarity.
- Segments transition smoothly across the designated pastel thresholds without flashes or strobe animations.