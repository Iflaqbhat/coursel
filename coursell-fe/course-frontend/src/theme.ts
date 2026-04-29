import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

/**
 * Coursell theme — inspired by the portfolio (index.html) palette.
 *
 *  --bg:        #080b0f
 *  --bg2:       #0d1117
 *  --bg3:       #111820
 *  --accent:    #00e5ff   (cyan)
 *  --accent2:   #7b61ff   (purple)
 *  --accent3:   #ff4d6d   (pink)
 *  --green:     #39d353
 *  --text:      #e2e8f0
 *  --text2:     #7d8fa3
 *  --text3:     #3d4f63
 */

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: 'rgba(0,229,255,0.05)',
      100: 'rgba(0,229,255,0.1)',
      200: 'rgba(0,229,255,0.2)',
      300: '#5ff0ff',
      400: '#2eebff',
      500: '#00e5ff',
      600: '#00b8cc',
      700: '#008b99',
      800: '#005e66',
      900: '#003133',
    },
    /* Override default purple to portfolio purple */
    purple: {
      50: 'rgba(123,97,255,0.08)',
      100: 'rgba(123,97,255,0.15)',
      200: 'rgba(123,97,255,0.25)',
      300: '#a392ff',
      400: '#8d77ff',
      500: '#7b61ff',
      600: '#6b50f0',
      700: '#5a3ed8',
      800: '#4a30b8',
      900: '#3a2698',
    },
    /* Map blue to cyan accent so existing colorScheme="blue" matches */
    blue: {
      50: 'rgba(0,229,255,0.05)',
      100: 'rgba(0,229,255,0.1)',
      200: 'rgba(0,229,255,0.2)',
      300: '#5ff0ff',
      400: '#2eebff',
      500: '#00e5ff',
      600: '#00b8cc',
      700: '#008b99',
      800: '#005e66',
      900: '#003133',
    },
    /* Override gray scale to dark portfolio surfaces */
    gray: {
      50: '#0d1117',
      100: '#111820',
      200: 'rgba(255,255,255,0.07)',
      300: 'rgba(255,255,255,0.12)',
      400: '#3d4f63',
      500: '#7d8fa3',
      600: '#a8b3c2',
      700: '#c9d2dc',
      800: '#e2e8f0',
      900: '#f7fafc',
    },
    pink: {
      50: 'rgba(255,77,109,0.05)',
      100: 'rgba(255,77,109,0.1)',
      200: 'rgba(255,77,109,0.2)',
      300: '#ff8fa3',
      400: '#ff6e88',
      500: '#ff4d6d',
      600: '#e83d5e',
      700: '#cc2c4a',
      800: '#a51e3a',
      900: '#7a1129',
    },
    green: {
      50: 'rgba(57,211,83,0.08)',
      100: 'rgba(57,211,83,0.15)',
      200: 'rgba(57,211,83,0.25)',
      300: '#7be896',
      400: '#5ddf78',
      500: '#39d353',
      600: '#26b340',
      700: '#1c8a31',
      800: '#0f5c20',
      900: '#063510',
    },
    surface: {
      900: '#080b0f',
      800: '#0d1117',
      700: '#111820',
      600: '#1a2330',
    },
    accent: {
      cyan: '#00e5ff',
      purple: '#7b61ff',
      pink: '#ff4d6d',
      green: '#39d353',
    },
  },
  fonts: {
    heading: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    body: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    mono: '"IBM Plex Mono", monospace',
    display: '"Bebas Neue", sans-serif',
  },
  styles: {
    global: {
      'html, body': {
        bg: '#080b0f',
        color: '#e2e8f0',
        fontFamily: '"Outfit", sans-serif',
      },
      '*::placeholder': {
        color: '#7d8fa3',
      },
      a: {
        color: 'brand.400',
        _hover: { color: 'brand.300', textDecoration: 'none' },
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
        letterSpacing: '0.5px',
        transition: 'all 0.25s ease',
        _focusVisible: { boxShadow: '0 0 0 3px rgba(0,229,255,0.35)' },
      },
      variants: {
        solid: () => ({
          bg: 'brand.500',
          color: '#080b0f',
          _hover: { bg: 'purple.500', color: 'white', transform: 'translateY(-2px)' },
          _active: { bg: 'purple.600', transform: 'translateY(0)' },
        }),
        accent: () => ({
          bg: 'purple.500',
          color: 'white',
          _hover: { bg: 'purple.400', transform: 'translateY(-2px)' },
        }),
        outline: () => ({
          borderColor: 'rgba(255,255,255,0.18)',
          color: 'white',
          _hover: {
            bg: 'rgba(0,229,255,0.06)',
            borderColor: 'brand.400',
            color: 'brand.300',
            transform: 'translateY(-1px)',
          },
        }),
        ghost: () => ({
          color: '#e2e8f0',
          _hover: { bg: 'rgba(0,229,255,0.06)', color: 'brand.300' },
        }),
        cyan: () => ({
          bg: 'brand.500',
          color: '#080b0f',
          fontFamily: 'mono',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontSize: '12px',
          _hover: { bg: 'purple.500', color: 'white' },
        }),
        link: () => ({
          color: 'brand.300',
          _hover: { color: 'brand.200' },
        }),
        success: { bg: 'green.500', color: '#080b0f', _hover: { bg: 'green.400' } },
        danger: { bg: 'pink.500', color: 'white', _hover: { bg: 'pink.400' } },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'md',
          fontFamily: 'body',
          color: '#e2e8f0',
          bg: 'rgba(255,255,255,0.04)',
          borderColor: 'rgba(255,255,255,0.12)',
          _placeholder: { color: '#7d8fa3' },
          _hover: { borderColor: 'brand.400' },
          _focus: {
            borderColor: 'brand.400',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)',
          },
        },
      },
      defaultProps: {
        focusBorderColor: 'brand.400',
      },
    },
    Textarea: {
      baseStyle: {
        borderRadius: 'md',
        color: '#e2e8f0',
        bg: 'rgba(255,255,255,0.04)',
        borderColor: 'rgba(255,255,255,0.12)',
        _placeholder: { color: '#7d8fa3' },
        _hover: { borderColor: 'brand.400' },
        _focus: {
          borderColor: 'brand.400',
          boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)',
        },
      },
      defaultProps: {
        focusBorderColor: 'brand.400',
      },
    },
    Select: {
      baseStyle: {
        field: {
          borderRadius: 'md',
          color: '#e2e8f0',
          bg: 'rgba(255,255,255,0.04)',
          borderColor: 'rgba(255,255,255,0.12)',
          _focus: {
            borderColor: 'brand.400',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)',
          },
          _hover: { borderColor: 'brand.400' },
        },
      },
      defaultProps: {
        focusBorderColor: 'brand.400',
      },
    },
    NumberInput: {
      baseStyle: {
        field: {
          color: '#e2e8f0',
          bg: 'rgba(255,255,255,0.04)',
          borderColor: 'rgba(255,255,255,0.12)',
          _focus: {
            borderColor: 'brand.400',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          bg: '#0d1117',
          border: '1px solid',
          borderColor: 'rgba(255,255,255,0.07)',
          color: '#e2e8f0',
          transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
          _hover: {
            borderColor: 'rgba(0,229,255,0.25)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: '#0d1117',
          color: '#e2e8f0',
          border: '1px solid',
          borderColor: 'rgba(255,255,255,0.12)',
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          bg: '#0d1117',
          borderColor: 'rgba(255,255,255,0.12)',
          color: '#e2e8f0',
        },
        item: {
          bg: 'transparent',
          color: '#e2e8f0',
          _hover: { bg: 'rgba(0,229,255,0.06)', color: 'brand.300' },
          _focus: { bg: 'rgba(0,229,255,0.06)', color: 'brand.300' },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        letterSpacing: 'tight',
        color: 'white',
      },
    },
    Text: {
      baseStyle: {
        color: '#c9d2dc',
      },
    },
    Link: {
      baseStyle: {
        color: 'brand.300',
        _hover: { color: 'brand.200', textDecoration: 'none' },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        fontWeight: 'semibold',
        textTransform: 'uppercase',
        fontSize: '10px',
        letterSpacing: '1.5px',
        px: 3,
        py: 1,
      },
      variants: {
        solid: { bg: 'brand.500', color: '#080b0f' },
        outline: { borderColor: 'brand.400', color: 'brand.300' },
        subtle: { bg: 'rgba(0,229,255,0.08)', color: 'brand.300' },
      },
    },
    Alert: {
      baseStyle: {
        container: {
          borderRadius: 'md',
        },
      },
    },
    Divider: {
      baseStyle: {
        borderColor: 'rgba(255,255,255,0.07)',
      },
    },
    Table: {
      baseStyle: {
        th: { color: '#7d8fa3', borderColor: 'rgba(255,255,255,0.08)' },
        td: { borderColor: 'rgba(255,255,255,0.06)', color: '#e2e8f0' },
      },
    },
    Tabs: {
      variants: {
        enclosed: {
          tab: {
            color: '#7d8fa3',
            _selected: { color: 'brand.400', borderColor: 'rgba(255,255,255,0.12)', bg: '#0d1117' },
          },
          tablist: { borderColor: 'rgba(255,255,255,0.12)' },
        },
      },
    },
    Tooltip: {
      baseStyle: {
        bg: '#111820',
        color: '#e2e8f0',
        borderRadius: 'md',
      },
    },
    Skeleton: {
      baseStyle: {
        startColor: 'rgba(255,255,255,0.04)',
        endColor: 'rgba(255,255,255,0.1)',
      },
    },
  },
});

export default theme;
