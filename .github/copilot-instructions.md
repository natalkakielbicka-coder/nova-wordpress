# NOVA WordPress Theme Guidelines

## Stack and structure

- This is a WordPress theme built on Sage 10 and Roots Acorn. PHP application classes use the `App\` namespace and live under `app/`.
- Follow the existing organization: WordPress setup and hooks in `app/`, Blade templates in `resources/views/`, Gutenberg block implementations in `resources/blocks/`, front-end modules in `resources/js/`, and styles in `resources/css/`.
- Acorn boots through `functions.php`; use the existing service providers, repositories, view composers, and helpers where applicable instead of introducing parallel mechanisms.
- Assets are built with Vite. Tailwind CSS 4 is integrated through `@tailwindcss/vite` and the CSS-first setup in `resources/css/app.css`. Vite inputs, aliases, and WordPress integration are defined in `vite.config.js`.
- Use existing dependencies and project patterns. Do not add a package or new architectural layer unless the task requires it.

## WordPress, Blade, and blocks

- Preserve WordPress hooks, theme behavior, and Gutenberg compatibility. Register and configure custom blocks through the existing `app/blocks.php` and `resources/blocks/<block>/` patterns.
- Keep block editor code, block metadata, render callbacks, and front-end behavior in their established locations. Reuse existing Blade components for repeated markup.
- Render theme views using Sage/Acorn conventions. Escape dynamic output with the appropriate WordPress escaping function; only output trusted or explicitly sanitized HTML unescaped.
- Preserve accessibility semantics, including labels, button types, pressed states, and keyboard behavior.

## Styling and design tokens

- Reuse NOVA color and typography tokens defined in `resources/css/app.css` and `theme.json` (for example `nova-ink`, `nova-text`, `nova-muted`, `nova-line`, `nova-background`, `nova-white`, `font-sans`, and `font-serif`).
- Keep the CSS theme tokens and WordPress editor palette aligned. Avoid introducing raw colors, font families, or duplicate design tokens when an existing token applies.
- Follow the existing Tailwind utility, component CSS, responsive breakpoint, and dark-theme conventions.

## JavaScript and animation

- Use the existing ES module structure and Vite entry points. Add behavior to the relevant existing component or animation module rather than duplicating initialization in `app.js`.
- Follow existing initializer and disposer patterns. Prevent duplicate event listeners and animation instances, and clean up resources when a module is disposed.
- GSAP, ScrollTrigger, and Flip are existing dependencies. Register plugins where used, respect `prefers-reduced-motion`, and preserve the existing lifecycle orchestration.
- Prefer animating `transform` and `opacity` over layout properties. Keep Flip targets and ScrollTrigger refreshes limited to what the layout change requires.
- All GSAP initializers must return an idempotent cleanup function.
- Preserve dynamic `prefers-reduced-motion` handling, including runtime preference changes.
- Do not reinitialize project layout event listeners when restarting GSAP animations.

## WooCommerce and behavior preservation

- Integrate WooCommerce through the existing hooks in `app/woocommerce.php`, theme templates, and modules such as `resources/js/woocommerce-gallery.js` and `resources/js/woocommerce-product-card.js`.
- Preserve WooCommerce templates, cart/checkout behavior, Store API integration, and existing WordPress interactions when changing shared layout or scripts.
- Make the smallest change that fully addresses the request. Do not alter unrelated functionality, duplicate existing logic, or add dependencies without need.
- `npm run build` is the defined asset-build command. Check `package.json` before assuming other project scripts or test commands exist.
