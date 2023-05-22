import { extendTheme } from '@chakra-ui/react';
import Button from "./button";
import IconButton from "./iconButton";

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

const customTheme = extendTheme({
    colors: {
        brand: {
            100: "#f7fafc",
            // ...
            900: "#1a202c",
        },
    },
    components: {
        Button,
        IconButton
    },

    config,
});

export default customTheme;