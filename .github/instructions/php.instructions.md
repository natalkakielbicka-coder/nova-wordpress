---
applyTo: "**/*.php"
---

# PHP Guidelines

- Keep application classes under the `App\` namespace and follow the existing `app/` organization: providers, repositories, support utilities, and view composers. Keep `functions.php` as the Acorn bootstrap and register theme files through the existing loading pattern.
- Use the project's PHP 8.2 minimum and existing Roots Acorn APIs; do not rely on newer PHP-only features without checking compatibility.
- Register WordPress behavior with the existing hooks and filters. Choose the narrowest appropriate hook and an explicit priority when ordering relative to existing callbacks matters; preserve existing hook behavior.
- Prepare view data in the relevant Acorn View Composer or existing repository, then pass it to Blade. Avoid database access and complex business logic in templates.
- Validate and sanitize input at the boundary using the appropriate WordPress functions. Escape output for its context (`esc_html`, `esc_attr`, `esc_url`, or `wp_kses_post`); return trusted markup only where the caller expects HTML.
- For state-changing admin, AJAX, or REST operations, verify a nonce where applicable and check the user's capability. A nonce is not a substitute for authorization.
- Prefer WordPress APIs and existing repositories over direct SQL. If a direct database query is necessary, use `$wpdb->prepare()` for all variable values and avoid interpolating untrusted input.
- Follow `app/woocommerce.php` for WooCommerce hooks and guard optional integrations with the existing availability checks. Preserve WooCommerce cart, checkout, product, and Store API behavior.
- Reuse existing queries and data providers; avoid duplicate queries, repeated hook registration, and parallel implementations of existing logic.
