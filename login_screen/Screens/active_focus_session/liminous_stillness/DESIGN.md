---
name: Liminous Stillness
colors:
  surface: '#fbfaed'
  surface-dim: '#dcdacf'
  surface-bright: '#fbfaed'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f4e8'
  surface-container: '#f0eee2'
  surface-container-high: '#eae9dc'
  surface-container-highest: '#e4e3d7'
  on-surface: '#1b1c15'
  on-surface-variant: '#424842'
  inverse-surface: '#303129'
  inverse-on-surface: '#f3f1e5'
  outline: '#727971'
  outline-variant: '#c2c8c0'
  surface-tint: '#44664c'
  primary: '#0d2e19'
  on-primary: '#ffffff'
  primary-container: '#24452d'
  on-primary-container: '#8db293'
  inverse-primary: '#aad0af'
  secondary: '#606129'
  on-secondary: '#ffffff'
  secondary-container: '#e6e7a1'
  on-secondary-container: '#66672f'
  tertiary: '#003009'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a471d'
  on-tertiary-container: '#84b680'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c6ecca'
  primary-fixed-dim: '#aad0af'
  on-primary-fixed: '#00210d'
  on-primary-fixed-variant: '#2d4e35'
  secondary-fixed: '#e6e7a1'
  secondary-fixed-dim: '#caca87'
  on-secondary-fixed: '#1c1d00'
  on-secondary-fixed-variant: '#484914'
  tertiary-fixed: '#bcf0b6'
  tertiary-fixed-dim: '#a1d39b'
  on-tertiary-fixed: '#002205'
  on-tertiary-fixed-variant: '#235025'
  background: '#fbfaed'
  on-background: '#1b1c15'
  surface-variant: '#e4e3d7'
  surface-mint: '#E7F6E6'
  surface-herbal: '#C3E5B2'
  border-dusty: '#A0AC9D'
  shadow-olive: '#5A5B2C'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
---

## Brand & Style

The visual philosophy is rooted in the concept of a "conscious layer"—a digital buffer designed to decelerate the user's interaction and restore emotional equilibrium. This design system rejects the high-dopamine patterns of modern SaaS in favor of a **Minimalist-Editorial** aesthetic that prioritizes psychological safety and intentionality.

The style is characterized by:
- **Restrained Minimalism:** Using negative space as a functional tool to reduce cognitive load.
- **Compact Modularity:** Information is organized into small, digestible units rather than sprawling dashboards, reflecting a "one thing at a time" philosophy.
- **Human-Centric Precision:** While the layouts are structured, the geometry is softened, and the color transitions are organic to evoke a sense of life and breathability.
- **Editorial Poise:** High-quality typography and disciplined hierarchies make the experience feel like a premium journal or a physical wellness space rather than a utility app.

## Colors

This palette is intentionally monochromatic-adjacent, relying on varying depths of green to create a soothing, "forest floor" hierarchy that calms the nervous system. 

- **Primary (Deep Moss Green):** Reserved for the most intentional actions (CTAs) and primary brand moments. It provides a grounded, stable anchor.
- **Secondary (Muted Sage):** Used for accents and highlighting secondary information without demanding immediate attention.
- **Tertiary (Soft Pastel Green):** The core background color, providing a soft, non-glare canvas that feels more organic than pure white.
- **Surface-Mint:** Used for card surfaces and UI containers to create subtle tonal separation from the background.
- **Neutral (Near Black Olive):** Replaces pure black for all text and iconography to avoid harsh contrast, maintaining a soft but legible reading experience.

## Typography

The typography system uses a pairing of **Sora** (as a high-quality alternative to Clash Display) and **Inter** to achieve an editorial, premium feel.

- **Headlines (Sora):** Selected for its geometric clarity and distinctive character. It should be used sparingly to mark transitions or provide "moments of reflection."
- **Body & Labels (Inter):** Chosen for its exceptional legibility at small sizes. In this system, Inter is used with slightly increased line heights to promote a relaxed reading pace.
- **Styling Note:** Headlines should rarely be fully bold. Use Medium or SemiBold weights to maintain a "restrained" look. All-caps should be reserved strictly for the smallest labels (`label-sm`) to denote category or metadata.

## Layout & Spacing

The layout philosophy is based on a **Compact Modular Grid**. Instead of fluid, edge-to-edge designs, content is contained within defined margins to create a sense of protection and boundaries.

- **Vertical Rhythm:** A strict 4px baseline grid ensures alignment. Spacing between modules should be consistent (e.g., 24px) to prevent the UI from feeling cluttered.
- **Mobile-First Constraints:** Components are designed with "touch-safe" heights (minimum 48px) but with "compact" internal padding to keep the interface feeling precise and high-end.
- **Intentional Friction:** Use generous margins (20px+) to ensure the user’s eye has a clear path, preventing the overwhelming "wall of data" common in productivity apps.

## Elevation & Depth

To maintain a grounded and "earthy" feel, this design system avoids floating shadows or high-contrast elevations.

- **Tonal Layering:** Depth is primarily communicated through color stepping. The background (`#B9EDB3`) sits at the lowest level, with cards (`#E7F6E6`) sitting on top. 
- **Subtle Ambient Shadows:** Where elevation is necessary (e.g., a primary action button or an active card), use an "Earth Olive" tinted shadow (`#5A5B2C` at 10-15% opacity). The shadow should have a large blur radius and minimal offset to mimic soft, natural top-down lighting.
- **Low-Contrast Outlines:** Use 1px borders in `Dusty Sage` (`#A0AC9D`) for input fields and secondary modules to provide structure without adding visual noise.

## Shapes

The shape language is "Soft Rounded," intended to feel like pebbles or smooth organic forms rather than aggressive industrial corners.

- **Base Radius:** 8px (`0.5rem`) for standard components like input fields and small buttons.
- **Large Radius:** 16px (`1rem`) for primary cards and modular containers.
- **Extra Large Radius:** 24px (`1.5rem`) for bottom sheets and large container overlays.
- **Pill-Shapes:** Reserved exclusively for tags, chips, and high-frequency interaction toggles to signify their "utility" status.

## Components

### Buttons
- **Primary:** Deep Moss Green background with Mint Cream text. Rounded (8px) or Pill-shaped. Subtle 2px vertical depth on press.
- **Secondary:** Transparent background with a Dusty Sage border and Near Black Olive text.
- **Interaction:** Hover/Tap states should involve a slight darkening of the background rather than a scale-up effect, keeping interactions "quiet."

### Cards
- **Structure:** 16px corner radius, Mint Cream background. 
- **Content:** Use internal margins of 16px or 20px. Avoid heavy headers; use typography hierarchy to define sections.

### Inputs & Chips
- **Inputs:** Minimalist style with a 1px border and a subtle Herbal Green focus state. No "glow" effects.
- **Chips:** Highly compact, pill-shaped. Used for "Conscious Decision" choices to reduce the effort of selection.

### Analytics & Insights
- **Visuals:** Bar graphs and charts must use the Sage and Moss greens. No bright "alert" colors. 
- **Mood:** Data should be presented as a "reflection," using soft edges and rounded ends on bars to avoid a "performance dashboard" feel.

### Saathi AI Interface
- **Character:** The AI's presence is marked by a unique "Soft Highlight" (`#C3E5B2`) background or a subtle glassmorphism effect to differentiate it as a conscious, reflective space.