/** Site-wide type scale (slightly smaller than default 16px body). */
export const SITE_TYPOGRAPHY_CSS = `
:root {
  --fs-hero: clamp(1.875rem, 4.5vw, 3.75rem) !important;
  --fs-section: clamp(1.625rem, 3.5vw, 2.5rem) !important;
  --fs-card-title: 1.3125rem !important;
  --fs-body-lg: 1rem !important;
  --fs-body: 0.9375rem !important;
  --fs-body-sm: 0.875rem !important;
}

html {
  font-size: 93.75%;
}
`;

const TYPOGRAPHY_REPLACEMENTS = [
  [/--fs-hero:\s*clamp\(\s*3\.5rem\s*,\s*8vw\s*,\s*7\.5rem\s*\)/gi, "--fs-hero:        clamp(1.875rem, 4.5vw, 3.75rem)"],
  [/--fs-hero:\s*clamp\(\s*2\.25rem\s*,\s*5vw\s*,\s*4\.5rem\s*\)/gi, "--fs-hero:        clamp(1.875rem, 4.5vw, 3.75rem)"],
  [/--fs-section:\s*clamp\(\s*2\.5rem\s*,\s*5\.5vw\s*,\s*5rem\s*\)/gi, "--fs-section:     clamp(1.625rem, 3.5vw, 2.5rem)"],
  [/--fs-section:\s*clamp\(\s*1\.875rem\s*,\s*4vw\s*,\s*3rem\s*\)/gi, "--fs-section:     clamp(1.625rem, 3.5vw, 2.5rem)"],
  [/--fs-card-title:\s*2\.691rem[^;\n]*/gi, "--fs-card-title:  1.3125rem"],
  [/--fs-card-title:\s*1\.5rem[^;\n]*/gi, "--fs-card-title:  1.3125rem"],
  [/--fs-body-lg:\s*1\.863rem[^;\n]*/gi, "--fs-body-lg:     1rem"],
  [/--fs-body-lg:\s*1\.125rem[^;\n]*/gi, "--fs-body-lg:     1rem"],
  [/--fs-body:\s*1\.656rem[^;\n]*/gi, "--fs-body:        0.9375rem"],
  [/--fs-body:\s*1rem[^;\n]*/gi, "--fs-body:        0.9375rem"],
  [/--fs-body-sm:\s*1\.5525rem[^;\n]*/gi, "--fs-body-sm:     0.875rem"],
  [/--fs-body-sm:\s*0\.9375rem[^;\n]*/gi, "--fs-body-sm:     0.875rem"]
];

export function normalizeTypographyInCss(css) {
  let normalized = css;

  for (const [pattern, replacement] of TYPOGRAPHY_REPLACEMENTS) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized;
}
