import { createTheme } from '@mui/material/styles';

// Create a custom MUI theme that complements Tailwind CSS
export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0ea5e9', // primary-500 from Tailwind
            light: '#38bdf8', // primary-400
            dark: '#0284c7', // primary-600
        },
        secondary: {
            main: '#6b7280', // gray-500
            light: '#9ca3af', // gray-400
            dark: '#374151', // gray-700
        },
        success: {
            main: '#22c55e', // success-500 from Tailwind
            light: '#4ade80', // success-400
            dark: '#16a34a', // success-600
        },
        warning: {
            main: '#f59e0b', // warning-500 from Tailwind
            light: '#fbbf24', // warning-400
            dark: '#d97706', // warning-600
        },
        error: {
            main: '#ef4444', // error-500 from Tailwind
            light: '#f87171', // error-400
            dark: '#dc2626', // error-600
        },
        background: {
            default: '#f9fafb', // gray-50
            paper: '#ffffff',
        },
        text: {
            primary: '#111827', // gray-900
            secondary: '#6b7280', // gray-500
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.25rem', // text-4xl
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '1.875rem', // text-3xl
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.5rem', // text-2xl
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.25rem', // text-xl
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1.125rem', // text-lg
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h6: {
            fontSize: '1rem', // text-base
            fontWeight: 600,
            lineHeight: 1.4,
        },
        body1: {
            fontSize: '1rem', // text-base
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem', // text-sm
            lineHeight: 1.5,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 6,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                    borderRadius: 8,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 6,
                    },
                },
            },
        },
    },
});