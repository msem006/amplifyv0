/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "var(--primary)",
                "primary-glow": "var(--primary-glow)",
                secondary: "var(--secondary)",
                accent: "var(--accent)",
                surface: "var(--surface)",
                "surface-border": "var(--surface-border)",
            },
            fontFamily: {
                sans: ["var(--font-sans)"],
            },
        },
    },
    plugins: [],
}
