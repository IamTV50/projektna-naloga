import { extendTheme } from '@chakra-ui/react';
import Button from "./button";
import IconButton from "./iconButton";

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

const breakpoints = {
    sm: '30em',
    md: '48em',
    xl: '80em',
    '2xl': '96em',
}

const customTheme = extendTheme({
    breakpoints: breakpoints,
    // colors: {
    //     brand: {
    //         100: "#f7fafc",
    //         // ...
    //         900: "#1a202c",
    //     },
    // },
    components: {
        Button,
        // IconButton
    },

    config,
});

export default customTheme;