---
applyTo: "resources/js/**/*.js"
---

# JavaScript Module Guidelines

- Follow the existing ES module style and Vite import patterns. Keep component behavior in its component module and use `app.js` to coordinate page-level initialization and dynamic imports.
- Guard page-specific initialization by checking for its DOM elements. When using dynamic imports, handle failures explicitly and check cancellation/session state before initializing modules whose import may finish late.
- Prevent duplicate event listeners and instances on repeated initialization. Keep handler references when listeners need removal, following the existing `projects-layout.js` pattern.
- For modules with disposable resources, return an idempotent cleanup function that removes listeners, observers, timers, or animations created by that module. GSAP animation initializers must return a cleanup that reverts their context or `gsap.matchMedia()` instance.
- Use the existing central `prefers-reduced-motion` lifecycle in `app.js` for GSAP. Do not add competing preference listeners or restart unrelated component initialization; keep content visible while motion is reduced and avoid reinitializing Grid/List listeners when resuming animations.
- Register GSAP plugins where used. Scope animations to their module, clean up ScrollTriggers and Flip animations, and avoid creating duplicate timelines or triggers.
- Check that queried elements exist before using them, and scope DOM queries to the relevant component where possible. Avoid unsafe assumptions about optional WordPress or WooCommerce globals.
- Preserve WooCommerce hooks and events already used by the theme, including `added_to_cart`, gallery behavior, and product-card interactions. Keep compatibility with WooCommerce's dynamically updated DOM and existing cart behavior.
