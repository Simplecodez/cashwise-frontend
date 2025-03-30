export const theme = {
  palette: {
    primary: '#059669', // Emerald green
    secondary: '#d97706', // Warm amber for contrast
    background: '#f0fdf4', // Cool white with a hint of green
    surface: '#ffffff', // Pure white for contrast
    text: '#065f46', // Deep emerald for readability
    textSecondary: '#6b7280', // Soft gray for subtle text
    accent: '#10b981', // Vibrant emerald accent
    error: '#ef4444', // A striking red for errors
    warning: '#f59e0b', // Bright warm yellow
    success: '#22c55e', // A lively green
    info: '#0ea5e9' // Cool blue for informational elements
  },
  elevation: {
    low: '0px 1px 3px rgba(5, 150, 105, 0.15)',
    medium: '0px 3px 6px rgba(5, 150, 105, 0.25)',
    high: '0px 5px 15px rgba(5, 150, 105, 0.35)'
  },
  shadow: {
    small: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    large: '0px 4px 8px rgba(0, 0, 0, 0.2)'
  },
  shape: {
    borderRadius: 10 // Subtle rounded corners for a smooth, clean feel
  },
  spacing: (factor: number) => `${0.5 * factor}rem`, // Balanced spacing
  typography: {
    fontFamily: "'Play', sans-serif",
    fontSize: 16,
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700
    },
    letterSpacing: '0.02em',
    lineHeight: 1.6
  }
};
