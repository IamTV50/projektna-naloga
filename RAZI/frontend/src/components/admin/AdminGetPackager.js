import React, { useState } from "react";
import {
    Badge,
    Box,
    Button,
    Card,
    Heading,
    HStack,
    IconButton,
    Spacer,
    Text,
    useColorMode,
    VStack
} from "@chakra-ui/react";
import {ArrowForwardIcon} from "@chakra-ui/icons";

function AdminGetPackager({ packager, setPackagerToNotActive, setPackagerToActive, handlePackagerClick }) {
    const { colorMode, toggleColorMode } = useColorMode()

    const handleClick = () => {
        handlePackagerClick(packager); // Pass the packager object to the handlePackagerClick function
    };

    return (
        <Box w={"100%"} alignContent={"start"} alignItems={"start"} paddingY={4}>
            {/*<Card variant={"elevated"} backgroundColor={"gray.300"} mb={5} p={5}>*/}
            <HStack alignContent={"space-between"}>
                <VStack align={"start"}>
                    <Heading as={"button"} onClick={handleClick} size={"md"}>Packager number: {packager.number}</Heading>
                    <HStack paddingY={2}>
                        {packager.active ? <Badge colorScheme={"green"}>Active</Badge> : <Badge colorScheme={"red"}>Inactive</Badge>}
                        {packager.public ? <Badge colorScheme={"orange"}>Public</Badge> : <Badge bgColor={colorMode === "light" ? "gray.300" : ""}>Private</Badge>}
                    </HStack>
                    {packager.active ?
                        <Button colorScheme={"gray"} onClick={() => setPackagerToNotActive(packager._id)}>Deactivate</Button>
                        :
                        <Button colorScheme={"gray"} onClick={() => setPackagerToActive(packager._id)}>Activate</Button>
                    }
                </VStack>
                <Spacer/>
                <IconButton aria-label='View History' icon={<ArrowForwardIcon fontSize="xl" />} onClick={handleClick} />
            </HStack>
            {/*</Card>*/}
        </Box>
    )
}

export default AdminGetPackager