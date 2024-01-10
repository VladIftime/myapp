/** @type {import('tailwindcss').Config} */
module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],

  content: ['./src/**/*.{html,svelte,js,ts}'],
  theme: {
    extend: {},
  },
  daisyui: {
      themes: [
        {
          mytheme: {
            "primary": "#B90035",
            "secondary": "#ff6600",
            "accent": "#00b1a4",
            "neutral": "#0c0006",
            "base-100": "#ffffff",
            "info": "#8F96EB",
            "success": "#00e3a4",
            "warning": "#ECD638",
            "error": "#ff6994",
          },
        },
      ],
    },
  plugins: [require("daisyui")],
}

