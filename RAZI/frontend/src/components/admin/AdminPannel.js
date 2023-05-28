import React, {useState, useEffect, useContext} from "react";
import AdminGetRequest from "./AdminGetRequest";
import AdminAddPackager from "./AdminAddPackager";
import AdminShowUsers from "./AdminShowUsers";
import AdminShowPackagers from "./AdminShowPackagers";
import {
	Box,
	Card,
	Center,
	IconButton,
	Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent,
	PopoverTrigger,
	Spacer,
	Tab,
	TabList,
	Tabs,
	useToast,
	useDisclosure, TabPanel, TabPanels, useColorMode, Heading, Input, Button
} from "@chakra-ui/react";
import AdminRequestsList from "./AdminRequestsList";
import AdminUsersList from "./AdminUsersList";
import {Navigate} from "react-router-dom";
import {UserContext} from "../../userContext";
import {AddIcon} from "@chakra-ui/icons";
import RequestPackager from "../RequestPackager";
import {motion} from "framer-motion";
import UnlockHistory from "../UnlockHistory";
import AdminUnlockHistory from "./AdminUnlockHistory";
import unlockHistory from "../UnlockHistory";

function AdminPannel() {
	const toast = useToast()
	const [requests, setRequests] = useState([]);
	const userContext = useContext(UserContext);
	const { colorMode, toggleColorMode } = useColorMode()

	// side panel
	const { isOpen, onToggle } = useDisclosure()
	const [selectedPackager, setSelectedPackager] = useState(null);
	const [packagerUnlocks, setPackagerUnlocks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	// add packager popover
	const firstFieldRef = React.useRef(null)
	const { onOpenPopover, onClosePopover, isOpenPopover } = useDisclosure()
	// handle changes
	const [refreshKeyRequests, setRefreshKeyRequests] = useState(0);


	const transition = {
		type: "spring",
		duration: 0.3
	};

	const variants = {
		open: { opacity: 1, scale: 1 },
		closed: { opacity: 0, scale: 0 }
	};

	const handlePackagerClick = (packager) => {
		const fetchUnlocks = async () => {
			try {
				const res = await fetch(`http://localhost:3001/unlocks/packagerUnlocks/${packager._id}`, {
					credentials: "include"
				})
				const data = await res.json();
				console.log("Unlock history:");
				console.log(data);

				if (!data.message) {
					setPackagerUnlocks(data);
				}
				else {
					setPackagerUnlocks([]);
				}

				setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		setSelectedPackager(packager);
		fetchUnlocks();
		if (!isOpen) {
			onToggle();
		}
		if (packager === selectedPackager) {
			onToggle();
		}
	};

	// const handleRequestAdd = (newRequest) => {
	// 	toast({
	// 		title: "Request added",
	// 		description: "Request added successfully",
	// 		status: "success",
	// 		duration: 3000,
	// 	})
	// 	// setRequests([...requests, newRequest]);
	//
	// 	setRefreshKeyRequests(prevKey => prevKey + 1);
	// };

	return (
		<Center flex={1}>
			{userContext.user ? "" : <Navigate replace to="/" />}
			{userContext.user.admin === true ? "" : <Navigate replace to="/" />}
			<Box w={isOpen ? "70%" : "50%"} h="70%" display="flex" flexDirection={"row"}>
				<Box marginRight={"10px"} borderRadius={"25"} padding={0} bgColor={colorMode === "light" ? "gray.100" : "gray.700"} boxShadow={"10px 15px 20px rgba(0, 0, 0, 0.1)"} width={"100%"} as={Card} height="100%" overflow="auto"
					 css={{
						 "&::-webkit-scrollbar": {
							 width: "0",
						 },
						 "&::-webkit-scrollbar-thumb": {
							 backgroundColor: "#888",
						 },
					 }}>
					<Tabs isLazy colorScheme={"blue"}>
						<TabList
							position="sticky"
							top="0"
							bgColor={colorMode === "light" ? "gray.100" : "gray.700"}
							zIndex="sticky"
							p={4}
							minWidth="100%"
							width="fit-content">
							<Tab>Requests</Tab>
							<Tab>Users</Tab>
							<Tab>Packagers</Tab>
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
										<AdminAddPackager />
										{/*<form onSubmit={AddPackagerToUser}>*/}
										{/*	<Heading my={2} size={"md"}>Add packager to user</Heading>*/}
										{/*	<Input my={2} type="number" name="number" placeholder="Number"*/}
										{/*		   value={packagerNumber} onChange={(e)=>(setPackagerNumber(e.target.value), setError(""))}/>*/}
										{/*	<Button my={2} colorScheme={"green"} type="submit" name="submit">Add</Button>*/}
										{/*</form>*/}
									</PopoverBody>
								</PopoverContent>
							</Popover>
						</TabList>
						<TabPanels paddingLeft={4} paddingTop={2}>
							<TabPanel>
								<Box flex={1} w="100%" h="100%" overflowY="auto">
									<AdminRequestsList key={refreshKeyRequests}/>
								</Box>
							</TabPanel>
							<TabPanel>
								<Box flex={1} w="100%" h="100%" overflowY="auto">
									<AdminShowUsers/>
								</Box>
							</TabPanel>
							<TabPanel>
								<Box flex={1} w="100%" h="100%" overflowY="auto">
									<AdminShowPackagers handlePackagerClick={handlePackagerClick}/>
								</Box>
							</TabPanel>
						</TabPanels>

					</Tabs>
				</Box>
				<Box marginLeft={"10px"}  w={isOpen ? "70%" : "0"} hidden={!isOpen} overflowY={"auto"}>
					{/*<Collapse in={isOpen} animateOpacity>*/}
					<Box
						flex={1}
						width="100%"
						h="100%"
						overflow="auto"
						bgColor={colorMode === "light" ? "gray.100" : "blue.800"}
						borderRadius={25}
						padding={10}
						boxShadow="10px 15px 20px rgba(0, 0, 0, 0.1)"
						as={motion.div}
						initial="closed"
						animate={isOpen ? "open" : "closed"}
						variants={variants}
						transition={transition}
						css={{
							"&::-webkit-scrollbar": {
								width: "0",
							},
							"&::-webkit-scrollbar-thumb": {
								backgroundColor: "#888",
							},
						}}>
						{selectedPackager && <AdminUnlockHistory packager={selectedPackager} unlockHistory={packagerUnlocks}/>}
					</Box>
					{/*</Collapse>*/}
				</Box>
			</Box>
		</Center>
		// <div>
		// 	<div>
		// 		<AdminAddPackager></AdminAddPackager>
		// 	</div>
		// 	<Box h={4}/>
		// 	<div>
		// 		<AdminRequestsList requests={requests} onRequestDeleted={handleIdDelete}></AdminRequestsList>
		//
		// 		{/*<h3>Zahteve:</h3>*/}
		// 		{/*<div>*/}
		// 		{/*	<ul>*/}
		// 		{/*		{isLoading ? "" : requests.map(request => (<AdminGetRequest request={request} key={request._id} onRequestDeleted={handleIdDelete}></AdminGetRequest>))}*/}
		// 		{/*	</ul>*/}
		// 		{/*</div>*/}
		// 	</div>
		// 	<Box h={4}/>
		// 	<div>
		// 		<AdminShowUsers onRequestDeleted={handleIdDelete}></AdminShowUsers>
		// 	</div>
		// 	<div>
		// 		<h3>Packagers list:</h3>
		// 		<AdminShowPackagers></AdminShowPackagers>
		// 	</div>
		// </div>
	);
}
 
export default AdminPannel;