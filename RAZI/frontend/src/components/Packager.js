import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
	Badge,
	Box,
	Button,
	Heading,
	HStack,
	Icon,
	IconButton,
	Spacer,
	Spinner,
	Text,
	useColorMode,
	VStack
} from "@chakra-ui/react";
import {ArrowForwardIcon, ArrowRightIcon} from "@chakra-ui/icons";

function Package(props) {
	const [packagerUnlocks, setPackagerUnlocks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { colorMode, toggleColorMode } = useColorMode()

	useEffect(() => {
		const fetchUnlocks = async () => {
			try {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/unlocks/packagerUnlocks/${props.packager._id}`, {
					credentials: "include"
				})
				const data = await res.json();
				console.log(data);

				if (!data.message) {
					setPackagerUnlocks(data);
				}

				setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		};

		fetchUnlocks();
	}, []);

    return (
		<Box as={"button"} w={"100%"} onClick={props.onToggle}>
        <HStack alignContent={"space-between"}>
			<VStack align={"start"}>
				<Heading size={"md"}>Packager number: {props.packager.number}</Heading>
				<HStack>
					{props.packager.active ? <Badge colorScheme={"green"}>Active</Badge> : <Badge colorScheme={"red"}>Inactive</Badge>}
					{props.packager.public ? <Badge colorScheme={"orange"}>Public</Badge> : <Badge bgColor={colorMode === "light" ? "gray.300" : ""}>Private</Badge>}
				</HStack>
				{isLoading ? "" : packagerUnlocks.length === 0 ? <Text>No unlocks</Text> :
				<>
					<h6>Last opened: {new Date(packagerUnlocks[0].openedOn).toLocaleString("de-DE")}</h6>
					<Text>By: {packagerUnlocks[0].user.username} {packagerUnlocks[0].success ? <Badge colorScheme={"green"}>Opened</Badge> : <Badge colorScheme={"red"}>Failed</Badge>}</Text>
					<Text>Reason: {packagerUnlocks[0].status}</Text>
				</>
				}
			</VStack>
			<Spacer/>
			<IconButton aria-label='View History' icon={<ArrowForwardIcon fontSize="xl" />} onClick={props.onToggle} />
        </HStack>
		</Box>
    );
}

export default Package;