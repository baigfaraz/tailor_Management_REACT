import axe from "axe-core";

/**
 * Runs axe on a rendered component and returns violation ids.
 * Color contrast is skipped (jsdom has no layout/CSS); contrast is checked
 * on the token pairs (tokens.md) and by axe in E2E on real pages.
 */
export async function axeViolations(container) {
  const result = await axe.run(container, {
    rules: {
      "color-contrast": { enabled: false },
      region: { enabled: false },
    },
  });
  return result.violations.map((v) => `${v.id}: ${v.help}`);
}
