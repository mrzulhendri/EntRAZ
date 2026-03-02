/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                raz: {
                    bg: "#0f172a",
                    card: "rgba(30, 41, 59, 0.7)",
                    primary: "#6366f1",
                    secondary: "#ec4899",
                    accent: "#8b5cf6",
                    text: "#f8fafc",
                    muted: "#94a3b8",
                }
            },
            backgroundImage: {
                'gradient-raz': 'linear-gradient(to right, #6366f1, #ec4899)',
                'glass-raz': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            },
            backdropBlur: {
                raz: '12px',
            }
        },
    },
    plugins: [],
};
