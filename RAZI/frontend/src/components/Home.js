import React from 'react';
import {Box, Heading, Image} from "@chakra-ui/react";

function Home() {
    return(
        <Box flex={1} position="relative">

            <Box
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                filter='auto' blur='4px' // Adjust the opacity and color here
            >
                <Image
                    src="https://th.bing.com/th/id/R.52667c3c3ec159fb08a76d69aa3eefff?rik=63pbzin%2b3YmEGQ&pid=ImgRaw&r=0"
                    w="100%"
                    h="100%"
                    objectFit="cover"
                />
            </Box>
            <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                textAlign="center"
                color="white"
                fontWeight="bold"
                fontSize="24px"
                textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
                zIndex="1">
                <Heading color={"black"} whiteSpace="nowrap" fontSize={70}><b>SMART</b> PARCEL <b>SPACES</b></Heading>
                <Heading color={"#01B1C5"} fontSize={40}>from Out-Of-Home to Home Delivery</Heading>
            </Box>
        </Box>
    );
}

export default Home;