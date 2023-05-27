import React from 'react';
import {Box, Image} from "@chakra-ui/react";

function Home() {
    return(
        <Box flex={1}>
            <Image
                src="https://th.bing.com/th/id/R.52667c3c3ec159fb08a76d69aa3eefff?rik=63pbzin%2b3YmEGQ&pid=ImgRaw&r=0"
                w="100%"
                h="100%"
                objectFit="cover"
            />

        </Box>
    );
}

export default Home;