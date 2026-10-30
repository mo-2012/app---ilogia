/** Shared Tailwind preset for every iLogia app. Colors map to CSS variables in src/tokens.css. */
const v = (name) => `rgb(var(--ilg-${name}) / <alpha-value>)`;
export default {
  theme: {
    screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
    extend: {
      colors: {
        brand: { 900: v('brand-900'), 800: v('brand-800'), 700: v('brand-700'), 100: v('brand-100') },
        gold: { 500: v('gold-500'), 700: v('gold-700'), 100: v('gold-100') },
        bg: v('bg'), cream: v('cream'), pen: v('pen'), lime: v('lime'), surface: v('surface'), ink: v('ink'), muted: v('muted'), line: v('line'),
        success: { DEFAULT: v('success'), bg: v('success-bg') },
        danger: { DEFAULT: v('danger'), bg: v('danger-bg') },
        warning: { DEFAULT: v('warning'), bg: v('warning-bg') },
      },
      fontFamily: { sans: 'var(--ilg-font-ui)', display: 'var(--ilg-font-display)' },
      fontSize: {
        xs: ['12px', '18px'], sm: ['13px', '20px'], base: ['15px', '26px'],
        lg: ['17px', '28px'], xl: ['20px', '32px'], '2xl': ['26px', '40px'], '3xl': ['34px', '50px'],
      },
      borderRadius: { sm: 'var(--ilg-radius-sm)', DEFAULT: 'var(--ilg-radius)', lg: 'var(--ilg-radius-lg)', xl: 'var(--ilg-radius-xl)' },
      boxShadow: { 1: 'var(--ilg-shadow-1)', 2: 'var(--ilg-shadow-2)' },
      transitionTimingFunction: { ilg: 'var(--ilg-ease)' },
    },
  },
};
