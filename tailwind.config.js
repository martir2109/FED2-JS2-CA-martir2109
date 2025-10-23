/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {
      // Add custom colors, spacing, fonts, etc. here
      colors: {
        primary: "#",
        secondary: "#",
      },
    },
  },
  plugins: [
    // e.g., require('@tailwindcss/forms')
  ],
};
