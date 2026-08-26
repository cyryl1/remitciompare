/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand
        "primary":                    "#003441",
        "primary-container":          "#0f4c5c",
        "on-primary":                 "#ffffff",
        "on-primary-container":       "#87bbce",
        "primary-fixed":              "#b6ebfe",
        "primary-fixed-dim":          "#9acee1",
        "on-primary-fixed":           "#001f28",
        "on-primary-fixed-variant":   "#114d5d",
        "inverse-primary":            "#9acee1",
        "surface-tint":               "#306576",

        "secondary":                  "#006971",
        "secondary-container":        "#5cf0ff",
        "on-secondary":               "#ffffff",
        "on-secondary-container":     "#006c74",
        "secondary-fixed":            "#84f3ff",
        "secondary-fixed-dim":        "#3cdae8",
        "on-secondary-fixed":         "#002023",
        "on-secondary-fixed-variant": "#004f55",

        "tertiary":                   "#003819",
        "tertiary-container":         "#005127",
        "on-tertiary":                "#ffffff",
        "on-tertiary-container":      "#4bca79",
        "tertiary-fixed":             "#7efba4",
        "tertiary-fixed-dim":         "#61de8a",
        "on-tertiary-fixed":          "#00210c",
        "on-tertiary-fixed-variant":  "#005228",

        // Accent / Brand extras
        "vibrant-green":              "#00D66B",
        "deep-navy":                  "#0A2540",
        "error-red":                  "#E63946",
        "data-gray":                  "#64748B",

        // Surface scale
        "background":                 "#f7f9fb",
        "surface":                    "#f7f9fb",
        "surface-bright":             "#f7f9fb",
        "surface-dim":                "#d8dadc",
        "surface-white":              "#FFFFFF",
        "surface-variant":            "#e0e3e5",
        "surface-container-lowest":   "#ffffff",
        "surface-container-low":      "#f2f4f6",
        "surface-container":          "#eceef0",
        "surface-container-high":     "#e6e8ea",
        "surface-container-highest":  "#e0e3e5",
        "inverse-surface":            "#2d3133",
        "inverse-on-surface":         "#eff1f3",

        // On-colors
        "on-surface":                 "#191c1e",
        "on-surface-variant":         "#40484b",
        "on-background":              "#191c1e",

        // Error
        "error":                      "#ba1a1a",
        "error-container":            "#ffdad6",
        "on-error":                   "#ffffff",
        "on-error-container":         "#93000a",

        // Outline
        "outline":                    "#70787c",
        "outline-variant":            "#c0c8cb",
      },

      borderRadius: {
        DEFAULT: "0.25rem",
        lg:      "0.5rem",
        xl:      "0.75rem",
        "2xl":   "1rem",
        full:    "9999px",
      },

      spacing: {
        "gutter":         "24px",
        "stack-sm":       "8px",
        "stack-md":       "16px",
        "stack-lg":       "32px",
        "section-gap":    "80px",
        "margin-mobile":  "16px",
        "container-max":  "1280px",
      },

      maxWidth: {
        "container-max": "1280px",
      },

      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        mono:    ["Inter", "monospace"],
      },

      fontSize: {
        "display-lg": ["48px",  { lineHeight: "56px", fontWeight: "800" }],
        "display-md": ["40px",  { lineHeight: "48px", fontWeight: "700" }],
        "headline-lg":["32px",  { lineHeight: "40px", fontWeight: "700" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-md":["28px",  { lineHeight: "36px", fontWeight: "600" }],
        "headline-sm":["24px",  { lineHeight: "32px", fontWeight: "600" }],
        "title-lg":   ["22px",  { lineHeight: "28px", fontWeight: "600" }],
        "title-md":   ["16px",  { lineHeight: "24px", fontWeight: "600" }],
        "title-sm":   ["14px",  { lineHeight: "20px", fontWeight: "600" }],
        "body-xl":    ["18px",  { lineHeight: "28px", fontWeight: "400" }],
        "body-md":    ["16px",  { lineHeight: "24px", fontWeight: "400" }],
        "body-sm":    ["14px",  { lineHeight: "20px", fontWeight: "400" }],
        "label-lg":   ["14px",  { lineHeight: "20px", fontWeight: "500" }],
        "label-sm":   ["12px",  { lineHeight: "16px", fontWeight: "500" }],
      },

      boxShadow: {
        "card":  "0 1px 4px 0 rgba(0,0,0,0.08)",
        "card-hover": "0 4px 16px 0 rgba(0,0,0,0.12)",
        "modal": "0 8px 32px 0 rgba(0,0,0,0.18)",
      },

      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },

      animation: {
        "fade-in":  "fade-in 0.25s ease-out both",
        "slide-up": "slide-up 0.4s ease-out both",
        "spin-slow": "spin-slow 1.4s linear infinite",
      },
    },
  },
  plugins: [],
}
