import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0f4ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1', // Primary purple
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },
    accent: {
      500: '#7c3aed', // Updated accent to match purple gradient
      600: '#4f46e5',
    },
    background: {
      100: '#f8fafc', // Light background
      900: '#0f172a', // Dark background
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
    },
  },
  fonts: {
    heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
        fontFamily: 'body',
        lineHeight: '1.6',
      },
      html: {
        scrollBehavior: 'smooth',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'xl',
        transition: 'all 0.2s',
        _focus: {
          boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
        },
      },
      variants: {
        solid: {
          bg: 'purple.600',
          color: 'white',
          _hover: {
            bg: 'purple.700',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'purple.800',
            transform: 'translateY(0)',
          },
        },
        accent: {
          bg: 'accent.500',
          color: 'white',
          _hover: {
            bg: 'accent.600',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'accent.600',
            transform: 'translateY(0)',
          },
        },
        outline: {
          borderColor: 'purple.500',
          color: 'purple.600',
          _hover: {
            bg: 'purple.50',
            borderColor: 'purple.600',
            transform: 'translateY(-1px)',
          },
        },
        ghost: {
          color: 'gray.600',
          _hover: {
            bg: 'purple.50',
            color: 'purple.600',
            transform: 'translateY(-1px)',
          },
        },
        success: {
          bg: 'success.500',
          color: 'white',
          _hover: {
            bg: 'success.600',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
        },
        danger: {
          bg: 'error.500',
          color: 'white',
          _hover: {
            bg: 'error.600',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
        },
      },
      sizes: {
        lg: {
          fontSize: 'md',
          px: 8,
          py: 4,
          h: 'auto',
        },
        md: {
          fontSize: 'sm',
          px: 6,
          py: 3,
          h: 'auto',
        },
        sm: {
          fontSize: 'xs',
          px: 4,
          py: 2,
          h: 'auto',
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'xl',
          transition: 'all 0.2s',
          _focus: {
            borderColor: 'purple.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
          },
          _hover: {
            borderColor: 'gray.300',
          },
        },
      },
    },
    Textarea: {
      baseStyle: {
        borderRadius: 'xl',
        transition: 'all 0.2s',
        _focus: {
          borderColor: 'purple.500',
          boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
        },
        _hover: {
          borderColor: 'gray.300',
        },
      },
    },
    Select: {
      baseStyle: {
        field: {
          borderRadius: 'xl',
          transition: 'all 0.2s',
          _focus: {
            borderColor: 'purple.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
            bg: 'white',
            color: 'gray.900',
          },
          _hover: {
            borderColor: 'purple.400',
            bg: 'gray.50',
          },
        },
      },
      variants: {
        filled: {
          field: {
            bg: 'gray.50',
            color: 'gray.900',
            _focus: {
              bg: 'white',
              color: 'gray.900',
            },
            _hover: {
              bg: 'gray.100',
            },
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '2xl',
          boxShadow: 'lg',
          transition: 'all 0.2s',
          _hover: {
            boxShadow: 'xl',
          },
        },
      },
    },
    Link: {
      baseStyle: {
        color: 'purple.600',
        _hover: {
          textDecoration: 'none',
          color: 'purple.700',
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        letterSpacing: 'tight',
      },
    },
    Text: {
      baseStyle: {
        color: 'gray.700',
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        fontWeight: 'medium',
      },
      variants: {
        solid: {
          bg: 'purple.500',
          color: 'white',
        },
        outline: {
          borderColor: 'purple.500',
          color: 'purple.600',
        },
        success: {
          bg: 'success.500',
          color: 'white',
        },
        error: {
          bg: 'error.500',
          color: 'white',
        },
      },
    },
    Alert: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
        },
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default theme; 