import { extendTheme } from '@chakra-ui/react';
import Button from "./button";

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

const customTheme = extendTheme({
    colors: {
        primary: '#FF0000',
        secondary: '#00FF00',
    },
    components: {
        Button
    },

    config,
});

export default customTheme;