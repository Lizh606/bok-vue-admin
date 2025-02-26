/** @type {import('tailwindcss').Config} */
import { getCssVar } from "./src/utils/cssFunc.ts"
module.exports = {
  prefix: "tw-",
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "480px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1400px"
    },
    extend: {
      fontFamily: {
        standard: "var(--font-family-standard)",
        firacode: "var(--font-family-firacode)",
        kaiti: "var(--font-family-kaiti)"
      },
      colors: {
        primary: getCssVar("text", "primary"),
        success: getCssVar("text", "success"),
        warning: getCssVar("text", "warning"),
        danger: getCssVar("text", "danger"),
        error: getCssVar("text", "error"),
        info: getCssVar("text", "info")
      },
      backgroundColor: {
        base: getCssVar("background", "base"),
        primary: getCssVar("background", "primary"),
        layout: getCssVar("background", "layout"),
        default: getCssVar("background", "default"),
        light: getCssVar("background", "light"),
        success: getCssVar("background", "success"),
        warning: getCssVar("background", "warning"),
        danger: getCssVar("background", "danger"),
        "primary-alpha10": getCssVar("background", "primary-alpha10"),
        "primary-alpha20": getCssVar("background", "primary-alpha20"),
        "warning-alpha10": getCssVar("background", "warning-alpha10"),
        "danger-alpha10": getCssVar("background", "danger-alpha10"),
        "success-alpha10": getCssVar("background", "success-alpha10"),
        "form-label": getCssVar("background", "form-label")
      },
      textColor: {
        base: getCssVar("text", "base"),
        primary: getCssVar("text", "primary"),
        light: getCssVar("text", "light"),
        success: getCssVar("text", "success"),
        warning: getCssVar("text", "warning"),
        danger: getCssVar("text", "danger"),
        error: getCssVar("text", "error"),
        empty: getCssVar("text", "empty"),
        active: getCssVar("text", "active"),
        disabled: getCssVar("text", "disabled")
      },
      borderColor: {
        base: getCssVar("border", "base"),
        light: getCssVar("border", "light"),
        primary: getCssVar("border", "primary"),
        danger: getCssVar("border", "danger"),
        "primary-alpha10": getCssVar("border", "primary-alpha10")
      },
      boxShadow: {
        light: `0 0 12px ${getCssVar("box-shadow", "light")}`,
        lighter: `0 0 6px ${getCssVar("box-shadow", "lighter")}`,
        dark: `0 0 12px ${getCssVar("box-shadow", "dark")}`,
        "primary-alpha10": `0 0 12px ${getCssVar("box-shadow", "primary-alpha10")}`,
        "danger-alpha10": `0 0 12px ${getCssVar("box-shadow", "danger-alpha10")}`
      }
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: [],
  safelist: []
}
