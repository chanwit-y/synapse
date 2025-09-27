export const colorPatterns = {
  hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  rgb: /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
  rgba: /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/,
  hsl: /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/,
  hsla: /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/,
};