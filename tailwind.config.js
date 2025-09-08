// tailwind.config.js
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx,html}",
    "./design-system/**/*.{js,ts,jsx,tsx,html,css,mdc}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      sm: "var(--breakpoint-mobile)px",   // mobile
      md: "var(--breakpoint-tablet)px",   // tablet
      lg: "1024px",  // small desktop - no token defined
      xl: "1280px",  // desktop - no token defined
      "2xl": "var(--breakpoint-desktop)px", // Figma base
    },

    // ✅ Colors: semantic tokens only
    colors: {
      surface: {
        page: "var(--surface-neutral-page)",
        card: "var(--surface-neutral-card)",
        elevated: "var(--surface-neutral-elevated)",
      },
      text: {
        display: "var(--text-neutral-display)",
        heading: "var(--text-neutral-heading)",
        title: "var(--text-neutral-title)",
        body: "var(--text-neutral-body)",
        subtle: "var(--text-neutral-subtle)",
        disabled: "var(--text-neutral-disabled)",
      },
      primary: {
        DEFAULT: "var(--surface-primary-default)",
        hover: "var(--surface-primary-hover)",
        disabled: "var(--surface-primary-disabled)",
      },
      secondary: {
        DEFAULT: "var(--surface-secondary-default)",
        hover: "var(--surface-secondary-hover)",
        disabled: "var(--surface-secondary-disabled)",
      },
      success: { DEFAULT: "var(--surface-success-default)", hover: "var(--surface-success-hover)" },
      warning: { DEFAULT: "var(--surface-warning-default)", hover: "var(--surface-warning-hover)" },
      error: { DEFAULT: "var(--surface-error-default)", hover: "var(--surface-error-hover)" },
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",
    },

    fontFamily: {
      body: ["var(--font-body)"],
      heading: ["var(--font-heading)"],
      display: ["var(--font-display)"],
    },

    // ✅ Typography: tokens only
    fontSize: {
      display: ["var(--font-display-display-mobile)", { lineHeight: "var(--line-display-display-mobile)" }],
      "heading-h1": ["var(--font-heading-h1-mobile)", { lineHeight: "var(--line-heading-h1-mobile)" }],
      "heading-h2": ["var(--font-heading-h2-mobile)", { lineHeight: "var(--line-heading-h2-mobile)" }],
      "heading-h3": ["var(--font-heading-h3-mobile)", { lineHeight: "var(--line-heading-h3-mobile)" }],
      "heading-h4": ["var(--font-heading-h4-mobile)", { lineHeight: "var(--line-heading-h4-mobile)" }],
      "heading-h5": ["var(--font-heading-h5-mobile)", { lineHeight: "var(--line-heading-h5-mobile)" }],
      "heading-h6": ["var(--font-heading-h6-mobile)", { lineHeight: "var(--line-heading-h6-mobile)" }],
      "body-sm": ["var(--font-body-sm-mobile)", { lineHeight: "var(--line-body-sm-mobile)" }],
      "body-md": ["var(--font-body-md-mobile)", { lineHeight: "var(--line-body-md-mobile)" }],
      "body-lg": ["var(--font-body-lg-mobile)", { lineHeight: "var(--line-body-lg-mobile)" }],
      "body-xl": ["var(--font-body-xl-mobile)", { lineHeight: "var(--line-body-xl-mobile)" }],
    },

    // ✅ Spacing
    spacing: {
      0: "0px",
      sm: "var(--spacing-mobile-sm)",
      md: "var(--spacing-mobile-md)",
      lg: "var(--spacing-mobile-lg)",
      xl: "var(--spacing-mobile-xl)",
      "2xl": "var(--spacing-mobile-2xl)",
    },

    // ✅ Radii & Borders
    borderRadius: {
      none: "var(--radius-none)",
      sm: "var(--radius-sm)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
      xl: "var(--radius-xl)",
      "2xl": "var(--radius-2xl)",
      "3xl": "var(--radius-3xl)",
      full: "9999px",
    },
    borderWidth: {
      DEFAULT: "var(--border-width-md)",
      sm: "var(--border-width-sm)",
      md: "var(--border-width-md)",
      lg: "var(--border-width-lg)",
    },

    extend: {
      boxShadow: {
        card: "0 var(--spacing-mobile-sm) var(--spacing-mobile-lg) var(--border-neutral-dark)", // Using spacing tokens
      },
    },
  },

  plugins: [
    require("./design-system/tailwind-plugin"),
  ],

  corePlugins: {
    preflight: true,
    container: false,
  },
};
