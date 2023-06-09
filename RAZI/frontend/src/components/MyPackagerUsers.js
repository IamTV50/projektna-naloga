import React from "react";
import {Badge, Box, Button, Heading, HStack, IconButton, Spacer, Text, VStack} from "@chakra-ui/react";
import {ArrowForwardIcon, CheckIcon, CloseIcon} from "@chakra-ui/icons";

function MyPackagerUsers(props) {
    const handleUserDelete = (packager) => {
        props.handleDelete(props.user, packager);
    }

    return(
        <Box w={"100%"}>
            <HStack alignContent={"space-between"}>
                <VStack align="baseline">
                    <Heading size={"md"}>User: {props.user.username}</Heading>
					{props.user.packagers.map((packager) => (
						<React.Fragment key={packager._id}>
							{packager.owner === props.owner && (
                                <Text pb={2}><IconButton mr={4} aria-label='Delete user packager' onClick={() => handleUserDelete(packager)} icon={<CloseIcon color={"red"} />}/> Packager: {packager.number} </Text>
							)}
						</React.Fragment>
					))}
                </VStack>
            </HStack>
        </Box>
    );
}

export default MyPackagerUsers;