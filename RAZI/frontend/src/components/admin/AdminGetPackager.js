import React, { useState } from "react";
import {Badge, Box, Button, Card, Heading, HStack, Text, useColorMode, VStack} from "@chakra-ui/react";

function AdminGetPackager({ packager, setPackagerToNotActive, setPackagerToActive}) {
    const { colorMode, toggleColorMode } = useColorMode()


    return (
        <Box as={"button"} w={"100%"} alignContent={"start"} alignItems={"start"} paddingY={4} >
            {/*<Card variant={"elevated"} backgroundColor={"gray.300"} mb={5} p={5}>*/}
                <VStack align={"start"}>
                    <Heading size={"md"}>Packager number: {packager.number}</Heading>
                    <HStack paddingY={2}>
                        {packager.active ? <Badge colorScheme={"green"}>Active</Badge> : <Badge colorScheme={"red"}>Inactive</Badge>}
                        {packager.public ? <Badge colorScheme={"orange"}>Public</Badge> : <Badge bgColor={colorMode === "light" ? "gray.300" : ""}>Private</Badge>}
                    </HStack>
                    {packager.active ?
                        <Button colorScheme={"blackAlpha"} onClick={() => setPackagerToNotActive(packager._id)}>Deactivate</Button>
                        :
                        <Button colorScheme={"blackAlpha"} onClick={() => setPackagerToActive(packager._id)}>Activate</Button>
                    }
                </VStack>
            {/*</Card>*/}
        </Box>
    )
}

export default AdminGetPackager