import React from "react";
import {Badge, Box, Button, Heading, HStack, IconButton, Spacer, Text, VStack} from "@chakra-ui/react";
import {ArrowForwardIcon, CheckIcon, CloseIcon} from "@chakra-ui/icons";

function MyPackagerRequest(props) {
	const handleRequestApprove = () => {
        props.handleApprove(props.request);
    }

    const handleRequestDelete = () => {
        props.handleDelete(props.request._id);
    }

    return(
        <Box w={"100%"}>
            <HStack alignContent={"space-between"}>
                <VStack align="baseline">
                    <Heading size={"md"}>Packager number: {props.request.packager.number}</Heading>
					<Text>By user: {props.request.user.username}</Text>
					<Text>Reason: {props.request.reason}</Text>
                    <Text>{new Date(props.request.created).toLocaleString("de-DE")} <Badge colorScheme={"orange"}>Pending</Badge></Text>

                    {/*<HStack>*/}
                    {/*    {props.packager.active ? <Badge colorScheme={"green"}>Active</Badge> : <Badge colorScheme={"red"}>Inactive</Badge>}*/}
                    {/*    {props.packager.public ? <Badge colorScheme={"orange"}>Public</Badge> : <Badge bgColor={"gray.300"}>Private</Badge>}*/}
                    {/*</HStack>*/}
                </VStack>
                <Spacer/>
				<IconButton aria-label='Approve reques' onClick={handleRequestApprove} icon={<CheckIcon color={"green"}/>} />
                <IconButton aria-label='Delete reques' onClick={handleRequestDelete} icon={<CloseIcon color={"red"}/>} />
            </HStack>
        </Box>
    );
}

export default MyPackagerRequest;