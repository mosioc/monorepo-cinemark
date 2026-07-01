# ADR-0007: Adopt Tailwind CSS v4 and Radix UI for Component Architecture

**Status:** Accepted  
**Date:** -  
**Author:** Mehdi Maleki  

## Context

We need a styling and component architecture that allows rapid UI development, ensures strict accessibility (a11y) compliance, and maintains a consistent "cinema" dark theme without writing custom CSS from scratch.

## Decision

We will use **Tailwind CSS v4** (utilizing its new CSS-first configuration) for utility styling, combined with **Radix UI** (via shadcn/ui patterns) for unstyled, accessible component primitives.

## Alternatives Considered

- **Material UI (MUI) / Ant Design:** Rejected. These libraries impose a strong visual identity that is difficult to override. They also carry a heavy runtime CSS-in-JS overhead.
- **Styled Components / Emotion:** Rejected. The React ecosystem is moving away from runtime CSS-in-JS due to performance costs and React Server Component incompatibility.
- **Bootstrap:** Rejected. Too generic, lacks the fine-grained control needed for a custom cinematic UI.

## Consequences

### Positive

- **Zero Runtime CSS:** Tailwind v4 generates CSS at build time. Radix provides logic without styles. This results in a tiny CSS footprint.
- **Accessibility by Default:** Radix UI handles complex WAI-ARIA patterns, keyboard navigation, and focus management out-of-the-box (crucial for forms and modals).
- **RSC Compatible:** Neither Tailwind nor Radix relies on runtime JavaScript for styling, making them fully compatible with Next.js Server Components.

### Negative & Risks

- **HTML Verbosity:** Tailwind can lead to "class soup" where components have massive `className` strings.
- **Mitigation:** We use `tailwind-merge` and `clsx` via a `cn()` utility. We strictly extract repeated UI patterns into `components/ui/` to prevent duplication.
