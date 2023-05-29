import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import {
	AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
	Badge,
	Box,
	Button,
	Card,
	Center,
	Divider,
	Heading,
	HStack,
	IconButton, Input,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverTrigger,
	Spacer,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useColorMode, useDisclosure, useToast,
	VStack
} from "@chakra-ui/react";
import {AddIcon, CloseIcon} from "@chakra-ui/icons";
import AdminUnlockHistory from "./AdminUnlockHistory";
import RequestPackager from "../RequestPackager";

function AdminShowUserProfile() {
	const toast = useToast()
	const location = useLocation();
  	const [user, setUser] = useState(location.state);
	const [userUnlocks, setUserUnlocks] = useState([]);
	const [updatedPackager, setUpdatedPackager] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [packagerNumber, setPackagerNumber] = useState("")
	const [error, setError] = useState("");
	const { colorMode, toggleColorMode } = useColorMode()

	const firstFieldRef = React.useRef(null)
	const { onOpenPopover, onClosePopover, isOpenPopover } = useDisclosure()

	// alert dialog
	const { isOpen, onOpen, onClose } = useDisclosure()
	const cancelRef = React.useRef()
	const [packagerToDelete, setPackagerToDelete] = useState(0)

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}`, {
					credentials: "include"
				})
				const data = await res.json();
				setUser(data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchUser();
	}, [updatedPackager]);

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/unlocks/userUnlocks/${user._id}`, {
					credentials: "include"
				})
				const data = await res.json();
				setUserUnlocks(data);
				setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		};

		fetchRequests();
	}, []);

	async function AddPackagerToUser(e) {
        e.preventDefault();
        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/addPackager`, {
            method: "PUT",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
				username: user.username,
				packagerNumber: packagerNumber
			})
        });
        const data = await res.json();
        console.log(data);

        if (data._id === undefined) {
			toast({
				title: "Error",
				description: data.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			})
            // setError(data.message);
        } else {
			setUpdatedPackager(packagerNumber)
		}

		setPackagerNumber(0);
    }

	const deletePackager = (pnum) => {
		setPackagerToDelete(pnum)
		onOpen()
        // confirmAlert({
        //     title: 'Confirm to submit',
        //     message: 'Are you sure you want to remove this packager from user?',
        //     buttons: [
        //         {
        //             label: 'Yes',
        //             onClick: () => {
        //                 fetch(`${process.env.REACT_APP_API_URL}/users/removePackager`, {
        //                     method: "PUT",
		// 					credentials: "include",
		// 					headers: { 'Content-Type': 'application/json'},
		// 					body: JSON.stringify({
		// 						username: user.username,
		// 						packagerNumber: pnum
		// 					})
        //                 }).then((res) => res.json())
		// 				.then((data) => {
		// 					if (!data.error) {
		// 						setUpdatedPackager(pnum)
		// 					}
		// 				})
		// 				.catch((err) => {
		// 					console.log("Error removing packager to user", err);
		// 				});
        //             }
        //         },
        //         {
        //             label: 'No',
        //         }
        //     ]
        // });
    };

	const handleDeletePackager = () => {
		fetch(`${process.env.REACT_APP_API_URL}/users/removePackager`, {
			method: "PUT",
			credentials: "include",
			headers: { 'Content-Type': 'application/json'},
			body: JSON.stringify({
				username: user.username,
				packagerNumber: packagerToDelete
			})
		}).then((res) => res.json())
		.then((data) => {
			if (!data.error) {
				setUpdatedPackager(packagerToDelete)
				onClose()
			}
		})
		.catch((err) => {
			console.log("Error removing packager to user", err);
		});
	}

	return (
		<Center flex={1}>
			<Box w="70%" h="70%" display="flex" flexDirection={"row"} borderRadius={"25"} padding={0} boxShadow={"10px 15px 20px rgba(0, 0, 0, 0.1)"} as={Card} bgColor={colorMode === "light" ? "gray.100" : "gray.700"}>
				<Box w="30%" h="100%" display="flex" flexDirection={"column"} alignItems={"start"} padding={10}>
					<Heading paddingBottom={10}>User info</Heading>
					<Text>Username: {user.username}</Text>
					<Text>Email: {user.email}</Text>
				</Box>
				<Box w="70%" h="100%" display="flex" flexDirection={"column"} alignItems={"start"} px={10} pb={10} overflow="auto"
					 css={{
						 "&::-webkit-scrollbar": {
							 width: "0",
						 },
						 "&::-webkit-scrollbar-thumb": {
							 backgroundColor: "#888",
						 },
					 }}>
					<Tabs isLazy colorScheme={"blue"} flex={1} w={"100%"} h={"100%"}>
						<TabList position="sticky"
								 top={0}
								 pt={10}
								 bgColor={colorMode === "light" ? "gray.100" : "gray.700"}
								 zIndex="sticky">
							<Tab>User Packagers</Tab>
							<Tab>User Unlocked Packagers</Tab>
							<Spacer/>
							<Popover
								isOpen={isOpenPopover}
								initialFocusRef={firstFieldRef}
								onOpen={onOpenPopover}
								onClose={onClosePopover}
								placement='bottom'
								closeOnBlur={false}>
								<PopoverTrigger>
									<IconButton aria-label="Search database" position="relative" right={0} icon={<AddIcon />} />
								</PopoverTrigger>
								<PopoverContent>
									<PopoverArrow/>
									<PopoverCloseButton fontSize="md"/>
									<PopoverBody>
										<form onSubmit={AddPackagerToUser}>
											<Heading my={2} size={"md"}>Add packager to user</Heading>
											<Input my={2} type="number" name="number" placeholder="Number"
												value={packagerNumber} onChange={(e)=>(setPackagerNumber(e.target.value), setError(""))}/>
											<Button my={2} colorScheme={"green"} type="submit" name="submit">Add</Button>
										</form>
									</PopoverBody>
								</PopoverContent>
							</Popover>
						</TabList>
						<TabPanels>
							<TabPanel>
								<Box flex={1} w="100%" h="100%" overflowY="auto">
								{user.packagers.length > 0 ?
									<>
										{user.packagers.map((packager) => (
											<Box key={packager._id}>
												<HStack alignContent={"space-between"} >
													<Heading size={"md"}>Packager number: {packager.number}</Heading>
													<Spacer/>
													<IconButton aria-label='Delete request' onClick={() => deletePackager(packager.number)} icon={<CloseIcon color={"red"}/>} />
												</HStack>
												<HStack paddingY={2}>
													{packager.active ? <Badge colorScheme={"green"}>Active</Badge> : <Badge colorScheme={"red"}>Inactive</Badge>}
													{packager.public ? <Badge colorScheme={"orange"}>Public</Badge> : <Badge bgColor={colorMode === "light" ? "gray.300" : ""}>Private</Badge>}
												</HStack>
												<Divider marginBottom={6}/>
											</Box>
										))}
									</>
									:
									<Text>No packagers</Text>
								}
								</Box>
							</TabPanel>
							<TabPanel>
								<Box flex={1} w="100%" h="100%" overflowY="auto">
									<AdminUnlockHistory unlockHistory={userUnlocks} />
								</Box>

							</TabPanel>
						</TabPanels>
					</Tabs>


				</Box>
			</Box>
			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
				isCentered>
				<AlertDialogOverlay>
					<AlertDialogContent>

						<AlertDialogHeader fontSize='lg' fontWeight='bold'>
							Remove packager
						</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure? You can't undo this action afterwards.
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button colorScheme={"blue"} ref={cancelRef} onClick={onClose}>
								Cancel
							</Button>
							<Button colorScheme={"red"} onClick={handleDeletePackager} ml={3}>
								Remove
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>


		</Center>
		// <div>
		// 	<div>
		// 		<h3>User info</h3>
		// 		<p>Username: {user.username}</p>
		// 		<p>Email: {user.email}</p>
		// 	</div>
		// 	<div>
		// 	<h3>User Packagers:</h3>
		// 		{user.packagers.length > 0 ?
		// 		<ul>
		// 			{user.packagers.map((packager) => (
		// 			<li key={packager._id}>
		// 				<span>packager number: {packager.number}</span>
		// 				<button onClick={() => deletePackager(packager.number)}>delete</button>
		// 			</li>
		// 			))}
		// 		</ul> :
		// 			<span>No packagers found for the user.</span>
		// 		}
		// 	</div>
		// 	<div>
		// 		<h3>User unlocked packagers:</h3>
		// 		{isLoading ? ""
		// 		: userUnlocks.message !== undefined ? <span>{userUnlocks.message}</span>
		// 		: <ul>
		// 			{userUnlocks.map((unlock) => (
		// 			<li key={unlock._id}>
		// 				<span>packager number: {unlock.packager.number}</span>
		// 				<span> successfully opened: {unlock.success ? "true" : "false"}</span>
		// 				<span> reason: {unlock.status}</span>
		// 				<span> date: {new Date(unlock.openedOn).toLocaleString("de-DE")}</span>
		// 			</li>
		// 			))}
		// 		</ul>
		// 		}
		// 	</div>
		// 	<div>
		// 		<form onSubmit={AddPackagerToUser}>
		// 			<input type="number" name="number" placeholder="Number"
		// 				value={packagerNumber} onChange={(e)=>(setPackagerNumber(e.target.value), setError(""))}/>
		// 			<input type="submit" name="submit" value="Add"/>
		// 			<label>{error}</label>
		// 		</form>
		// 	</div>
		// </div>
	 );
}
 
export default AdminShowUserProfile;