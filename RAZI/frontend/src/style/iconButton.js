import {defineStyleConfig, keyframes, useColorModeValue} from '@chakra-ui/react'

const spin = keyframes`
  from {transform: skewX(-25deg);}
  to {transform: rotate(360deg)}
`;

const IconButton = defineStyleConfig({
    // The styles all button have in common
    baseStyle: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderRadius: 'base', // <-- border radius is same for all variants and sizes
    },
    // Two sizes: sm and md
    sizes: {
        sm: {
            fontSize: 'sm',
            px: 4, // <-- px is short for paddingLeft and paddingRight
            py: 3, // <-- py is short for paddingTop and paddingBottom
        },
        md: {
            fontSize: 'md',
            px: 6, // <-- these values are tokens from the design system
            py: 4, // <-- these values are tokens from the design system
        },
    },

    // Two variants: outline and solid
    variants: {
        header: {
            border: '2px solid',
            borderColor: "gray.300",
            // bg: 'blue.400',
            // color: 'white',
            // transform: "skewX(-25deg)",
            transition: "border-color 0.3s",
            // animation: `${spin} 1s linear infinite`,
            // transition: "skewX 1s",
            _hover: {
                borderColor: "blue.500",
                // animation: `${spin} 2s linear infinite`
            }
        },
        green: {
            border: '2px solid',
            borderColor: 'green.500',
            color: 'green.500',
            _hover: {
                // Customize the hover color for the green variant
                bg: 'green.100',
            },
        },
        outline: {
            border: '2px solid',
            borderColor: 'purple.500',
            color: 'purple.500',
        },
        solid: {
            bg: 'purple.500',
            color: 'white',
        },
    },
    // The default size and variant values
    defaultProps: {
        size: 'md',
        variant: 'outline',
    },
})

export default IconButton;