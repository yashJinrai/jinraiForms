/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                primary: '#3713ec',
                'background-light': '#f6f6f8',
                'background-dark': '#131022',
            },
            fontFamily: {
                display: ['Inter']
            },
            borderRadius: {
                DEFAULT: '0.25rem',
                lg: '0.5rem',
                xl: '0.75rem',
                full: '9999px'
            }
        },
    },
    darkMode: 'class',
}
