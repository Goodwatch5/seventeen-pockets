# Color System — Seventeen Pockets

**Part of the ODell Ecosystem | Branded by ODell | Powered by ODell and Light Creations**

***

## Overview

The Seventeen Pockets color system is designed to support our brand pillars of utility-first design, thoughtful storytelling, and intentional communication. Each color serves a specific purpose and works together to create a cohesive visual experience.

***

## Primary Palette

### Primary (Brand) Color

**Purpose:** Core brand identity, logo, hero sections, primary CTAs

* **Hex:** `[To be defined]`
* **RGB:** `[To be defined]`
* **HSL:** `[To be defined]`
* **WCAG Contrast:** AA compliant

**Usage:**

* Logo and brand mark
* Hero section backgrounds
* Primary buttons and links
* Key visual elements
* Brand-defining moments

### Accent Color

**Purpose:** Call-to-action, highlights, secondary emphasis

* **Hex:** `[To be defined]`
* **RGB:** `[To be defined]`
* **HSL:** `[To be defined]`
* **WCAG Contrast:** AA compliant

**Usage:**

* Call-to-action buttons
* Highlight elements
* Interactive states
* Secondary emphasis
* Visual interest points

### Neutral Color

**Purpose:** Copy, backgrounds, supporting elements

* **Hex:** `[To be defined]`
* **RGB:** `[To be defined]`
* **HSL:** `[To be defined]`
* **WCAG Contrast:** AAA compliant for text

**Usage:**

* Body text and copy
* Background colors
* Supporting elements
* Structural components
* Secondary information

***

## Extended Palette

### Neutral Variations

**Light Neutral**

* **Hex:** `[To be defined]`
* **Purpose:** Light backgrounds, subtle dividers

**Medium Neutral**

* **Hex:** `[To be defined]`
* **Purpose:** Secondary text, disabled states

**Dark Neutral**

* **Hex:** `[To be defined]`
* **Purpose:** Primary text, strong emphasis

### Semantic Colors

**Success**

* **Hex:** `[To be defined]`
* **Purpose:** Positive actions, confirmations, success states

**Warning**

* **Hex:** `[To be defined]`
* **Purpose:** Alerts, cautions, warnings

**Error**

* **Hex:** `[To be defined]`
* **Purpose:** Errors, destructive actions, critical alerts

**Info**

* **Hex:** `[To be defined]`
* **Purpose:** Information, helpful hints, notifications

***

## Color Usage Guidelines

### Primary Color

✅ **Do:**

* Use for logo and brand mark
* Use for hero sections and key moments
* Use for primary CTAs
* Maintain brand consistency
* Ensure sufficient contrast

❌ **Don't:**

* Use for body text
* Overuse in layouts
* Combine with conflicting colors
* Use in low-contrast situations
* Dilute brand impact through overuse

### Accent Color

✅ **Do:**

* Use for secondary CTAs
* Use for highlights and emphasis
* Use for interactive elements
* Create visual hierarchy
* Support user guidance

❌ **Don't:**

* Use for primary text
* Use as background for large areas
* Combine with primary without clear hierarchy
* Use without purpose
* Create visual confusion

### Neutral Color

✅ **Do:**

* Use for body text and copy
* Use for backgrounds
* Use for supporting elements
* Ensure readability
* Maintain accessibility

❌ **Don't:**

* Use for primary brand moments
* Use without sufficient contrast
* Use for CTAs
* Ignore accessibility standards
* Create visual monotony

***

## Accessibility Standards

### WCAG Compliance

All colors in the Seventeen Pockets system meet or exceed WCAG AA standards for contrast ratios:

* **Text on Background:** Minimum 4.5:1 contrast ratio
* **Large Text:** Minimum 3:1 contrast ratio
* **UI Components:** Minimum 3:1 contrast ratio

### Color Blindness Considerations

* Avoid red/green combinations for critical information
* Use patterns or icons in addition to color
* Test designs with color blindness simulators
* Provide alternative visual cues

### Dark Mode Support

Colors should be tested and adjusted for:

* Dark mode interfaces
* High contrast modes
* Reduced motion preferences
* Different lighting conditions

***

## Implementation

### CSS Variables

```css
:root {
  /* Primary Palette */
  --color-primary: [Hex];
  --color-accent: [Hex];
  --color-neutral: [Hex];
  
  /* Neutral Variations */
  --color-neutral-light: [Hex];
  --color-neutral-medium: [Hex];
  --color-neutral-dark: [Hex];
  
  /* Semantic Colors */
  --color-success: [Hex];
  --color-warning: [Hex];
  --color-error: [Hex];
  --color-info: [Hex];
}
```

### Usage Example

```css
.button-primary {
  background-color: var(--color-primary);
  color: white;
}

.button-secondary {
  background-color: var(--color-accent);
  color: white;
}

.text-body {
  color: var(--color-neutral-dark);
}
```

***

## Design Tools

### Figma

* Color library available in Seventeen Pockets Figma workspace
* Shared color styles for consistency
* Auto-update across all designs

### Development

* CSS variables in main stylesheet
* Tailwind config for web projects
* Design tokens for consistency

***

## Color Swatches

### Primary Palette

| Color           | Hex               | RGB               | Usage                      |
| --------------- | ----------------- | ----------------- | -------------------------- |
| Primary (Brand) | `[To be defined]` | `[To be defined]` | Logo, hero, primary CTAs   |
| Accent          | `[To be defined]` | `[To be defined]` | Secondary CTAs, highlights |
| Neutral         | `[To be defined]` | `[To be defined]` | Copy, backgrounds          |

### Extended Palette

| Color          | Hex               | RGB               | Usage             |
| -------------- | ----------------- | ----------------- | ----------------- |
| Light Neutral  | `[To be defined]` | `[To be defined]` | Light backgrounds |
| Medium Neutral | `[To be defined]` | `[To be defined]` | Secondary text    |
| Dark Neutral   | `[To be defined]` | `[To be defined]` | Primary text      |
| Success        | `[To be defined]` | `[To be defined]` | Positive actions  |
| Warning        | `[To be defined]` | `[To be defined]` | Alerts            |
| Error          | `[To be defined]` | `[To be defined]` | Errors            |
| Info           | `[To be defined]` | `[To be defined]` | Information       |

***

## Brand Alignment

The Seventeen Pockets color system supports our brand pillars:

* **Utility-First Design:** Colors serve clear, functional purposes
* **Thoughtful Storytelling:** Colors create emotional connection and narrative
* **Sustainable Materials:** Colors reflect natural, intentional aesthetic
* **Collaborative Craftsmanship:** Colors work together harmoniously

***

## Legal & Compliance

### Copyright & Licensing

**Copyright (c) 2025 ODell Anderson**

The Seventeen Pockets color system is the intellectual property of ODell Anderson and the Seventeen Pockets brand. All color specifications, palettes, and usage guidelines are protected.

For licensing inquiries or usage permissions, contact: iknewnothingnew@gmail.com

### Platform Disclaimer

This color system documentation is hosted on GitLab and/or GitHub. We do not own, operate, or control GitLab, GitHub, or any Git-related infrastructure. These are third-party services we utilize for version control and collaboration.

### Compliance

All uses of the Seventeen Pockets color system must comply with:

* [LEGAL\_COMPLIANCE.md](../docs/legal_compliance.md) - Core compliance requirements
* [brand-manifest.md](../brand-manifest.md) - Brand guidelines
* [CONTRIBUTING.md](../contributing.md) - Contribution guidelines

***

## Updates & Maintenance

**Last Updated:** 2025-12-29 **Next Review:** 2026-03-29

Color specifications are subject to refinement as the brand evolves. All changes will be documented and communicated to stakeholders.

***

## Contact

**Brand Owner:** Odell Anderson **Email:** iknewnothingnew@gmail.com

For color system inquiries, brand questions, or feedback, please reach out.
