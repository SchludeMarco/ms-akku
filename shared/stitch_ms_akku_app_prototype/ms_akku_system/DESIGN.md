---
name: MS Akku System
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#3f4947'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#6f7978'
  outline-variant: '#bfc8c7'
  surface-tint: '#2a6864'
  primary: '#004743'
  on-primary: '#ffffff'
  primary-container: '#1f5f5b'
  on-primary-container: '#99d7d1'
  inverse-primary: '#95d2cc'
  secondary: '#8f4e00'
  on-secondary: '#ffffff'
  secondary-container: '#fea047'
  on-secondary-container: '#6d3a00'
  tertiary: '#3c3b5b'
  on-tertiary: '#ffffff'
  tertiary-container: '#545274'
  on-tertiary-container: '#cac7ef'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0eee8'
  primary-fixed-dim: '#95d2cc'
  on-primary-fixed: '#00201e'
  on-primary-fixed-variant: '#06504c'
  secondary-fixed: '#ffdcc2'
  secondary-fixed-dim: '#ffb77a'
  on-secondary-fixed: '#2e1500'
  on-secondary-fixed-variant: '#6d3a00'
  tertiary-fixed: '#e3dfff'
  tertiary-fixed-dim: '#c6c2ea'
  on-tertiary-fixed: '#191836'
  on-tertiary-fixed-variant: '#454364'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
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
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is built specifically for adults managing Multiple Sclerosis (MS). The brand narrative centers around pacing, dignity, and restorative clarity. It deliberately rejects sterile clinical tropes, stark hospital whites, and alarmist diagnostics in favor of an atmosphere that feels like a quiet sanctuary or a thoughtfully crafted paper journal.

### Design Principles
- **Compassionate Pacing:** The interface actively mitigates cognitive strain and visual fatigue ("brain fog"). Screen compositions prioritize ample negative space, unambiguous structure, and linear decision paths over dense dashboards.
- **Non-Punitive States:** Fluctuations in physical or cognitive energy are natural realities, not deficits or personal failures. The energy metaphor ("Akku") avoids aggressive red indicators or low-battery alerts. Depleted states are framed through soothing, restorative tones that encourage rest.
- **Motor & Sensory Dignity:** Every interactive touchpoint anticipates hand tremors, spasticity, and reduced fine motor control. Large targets, generous hit zones, and low-friction inputs provide effortless physical interaction.
- **Warm Minimalist Tactility:** Surfaces are grounded in tactile, warm neutrals with soft, diffused depth. Avoid hyper-stylized digital trends like intense glassmorphism, stark neomorphism, or skeuomorphic gimmicks.

## Colors

The palette establishes an emotional baseline of calm reassurance and accessibility, meeting WCAG AAA standard contrast ratios across all core body text, labels, and primary state indicators.

### Key Palettes & Energy States
- **Primary (Deep Restorative Sage / Teal):** `#1F5F5B` serves as the anchor for primary navigation, primary buttons, and selected states. Its tonal variants provide atmospheric foundations: `#133D3A` for deep interactive contrast and `#E8F2F1` for soft tinted chip fills and active card containers.
- **Secondary (Warm Golden Amber):** `#D9822B` represents sustained vitality and midday warm energy. It illuminates active pacing progress and gentle highlights without inducing anxiety.
- **Tertiary (Dusky Lavender / Restorative Periwinkle):** `#7C7A9E` defines low energy, rest, and sleep reflection phases. It reframes exhaustion into quiet restoration. Light tint: `#EFEFF6`.
- **Neutral Canvas & Surfaces:** Background canvases use a soft warm linen `#FBFBF9`, transitioning to elevated card surfaces in pure white `#FFFFFF`. Structural borders leverage a grounded warm tint `#E4E5E1`.
- **Typography Neutrals:** Primary headlines and text render in slate charcoal `#1E293B`. Secondary metadata, microcopy, and inactive icons use `#475569`.
- **Semantic & Clinical Boundaries:**
  - Stable / Positive Change: Soft Emerald `#10B981` (tint: `#ECFDF5`).
  - Noticeable Fluctuation: Gentle Amber `#D97706` (tint: `#FFFBEB`).
  - Critical Actions: Grounded Dark Burgundy `#991B1B` (reserved strictly for destructive actions such as permanent log deletion). Never use high-visibility red for daily health fluctuations or low stamina readouts.

## Typography

Plus Jakarta Sans is selected across all roles for its wide apertures, clean geometric humanist proportions, and superior legibility during episodes of optical neuritis or visual strain.

### Typesetting Rules
- **Line Length & Flow:** Limit body copy paragraphs to a maximum of 45-60 characters per line. Generous line heights (`1.5` to `1.6`) ensure readers do not lose track when shifting between lines.
- **Visual Weight & Hierarchy:** Rely on font weight steps (700 Bold for headers, 600 Semi-Bold for interactive controls, 400 Regular for narrative blocks) rather than extreme size jumps. This prevents disorienting jumps in screen density.
- **Numbers & Metrics:** Tabular figures are used for all symptom scales, timestamps, and battery percentages to prevent visual jittering across dynamic tracking values.

## Layout & Spacing

The layout model is mobile-first, prioritizing ergonomic single-handed use within comfortable reach zones of thumb interaction.

### Structural Parameters
- **Margins & Safe Zones:** A standard canvas margin of `1.25rem` (20px) on compact handheld devices prevents interactive controls from hugging hardware edges, expanding to `1.5rem` (24px) on tablets.
- **Spatial Rhythm:** Spatial units strictly use increments of 8px (with 4px for micro-spacing inside badge wrappers). Vertical stacks between disparate symptom cards enforce a generous `space-lg` (24px) margin to prevent unintended taps.
- **Touch Boundaries:** All interactive components enforce an absolute minimum touch box of `48px x 48px`, expanding to `56px` for primary recording actions and modal triggers.

## Elevation & Depth

Visual depth is achieved through gentle tonal separation supported by low-opacity, warm-tinted ambient shadows. Crisp, high-contrast drop shadows and artificial glassy blurs are prohibited to minimize sensory overload.

### Elevation Hierarchy
- **Level 0 (Base Canvas):** `#FBFBF9` flat linen surface.
- **Level 1 (Card Containers & Inactive Modules):** Pure white `#FFFFFF` surface with a subtle perimeter border (`1px solid #E4E5E1`) and a soft ambient shadow (`0 2px 8px rgba(31, 95, 91, 0.04)`).
- **Level 2 (Active/Selected Modules & Floating Action Buttons):** Pure white surface, active tinted border (`1.5px solid #1F5F5B`), and a slightly expanded ambient lift (`0 6px 20px rgba(31, 95, 91, 0.08)`).
- **Level 3 (Modals & Bottom Sheets):** Pure white surface layered over an accessible, darkened warm overlay (`rgba(30, 41, 59, 0.4)`), applying `0 12px 32px rgba(19, 61, 58, 0.12)`.

## Shapes

The design system employs a friendly, rounded shape language (`roundedness: 2`) that conveys warmth, safety, and physical gentleness.

### Geometry Specifications
- **Standard Surfaces (Cards, Modals, Banners):** Rounded corners using `1rem` (16px) to eliminate hard, sharp vectors that feel clinical or aggressive.
- **Interactive Controls (Inputs, Action Buttons, Selection Steppers):** Molded with `0.75rem` (12px) to provide clear target boundaries.
- **Interactive Chips & Floating Elements:** Fully pill-shaped (`9999px`) for category filters, status chips, and the central action button.

## Components

### Buttons & Action Controls
- **Primary CTA:** Minimum height `54px`, fully filled with `#1F5F5B`, text label in `#FFFFFF` (16px Semi-Bold), with `12px` border-radius. Active tap states subtly transition to `#133D3A` without jarring scale animations.
- **Secondary Action:** Minimum height `54px`, surface `#E8F2F1`, label text in `#1F5F5B`, no border.
- **Destructive Action:** Low-key flat button with text in `#991B1B`, requiring a two-step confirm sheet before proceeding.

### Energy Battery Display ("Akku")
- A clean, horizontal or circular segmented reservoir. Rather than empty/critical metaphors, depleted states transition from Deep Sage (High Capacity: 70–100%) to Warm Amber (Pacing Zone: 35–69%) to Dusky Lavender (Rest Needed: 0–34%).
- Accompanied by supportive pacing microcopy: "Zeit für eine bewusste Pause" (Time for a mindful pause) rather than "Warnung: Akku kritisch".

### Selectable Filter Chips & Symptom Tags
- Height: `48px` to guarantee tap accessibility.
- Default State: Background `#FFFFFF`, border `1px solid #E4E5E1`, text `#475569`.
- Selected State: Background `#E8F2F1`, border `1.5px solid #1F5F5B`, text `#1F5F5B`, accompanied by a trailing checkmark icon.

### Form Inputs & Steppers
- Height `56px`. Border `1.5px solid #E4E5E1`, background `#FFFFFF`. Focus indicator: `#1F5F5B` outer ring (`2px`).
- Slider / Rating Track: Thickened thumb target (`32px` physical diameter, centered within a `48px` invisible hit region), resting on an `8px` rounded rail with high-contrast filled indicators.

### Navigation & Prominent Action Bar
- **Bottom Navigation Bar:** Fixed bottom container, height `72px`, white background with top border `1px solid #E4E5E1`. Hosts 4 destinations ("Heute", "Verlauf", "Muster", "Mehr") with icon and persistent text label.
- **Center Action Button ("+ Veränderung erfassen"):** Elevated floating button or integrated center-dock pill, styled in Primary Deep Sage `#1F5F5B` with white icon and bold typography, elevated at Level 2.

### Privacy & Context Badges
- Non-interactive indicators displaying local storage encryption status: Height `32px`, pill-shaped, neutral warm gray background `#F1F2ED`, text `#475569`, paired with a simple shield icon.