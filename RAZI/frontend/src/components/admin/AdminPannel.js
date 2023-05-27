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
	useDisclosure, TabPanel, TabPanels, useColorMode
} from "@chakra-ui/react";
import AdminRequestsList from "./AdminRequestsList";
import AdminUsersList from "./AdminUsersList";
import {Navigate} from "react-router-dom";
import {UserContext} from "../../userContext";
import {AddIcon} from "@chakra-ui/icons";
import RequestPackager from "../RequestPackager";

function AdminPannel() {
	const toast = useToast()
	const [requests, setRequests] = useState([]);
	const userContext = useContext(UserContext);
	const { colorMode, toggleColorMode } = useColorMode()

	// side panel
	const { isOpen, onToggle } = useDisclosure()
	// add packager popover
	const firstFieldRef = React.useRef(null)
	const { onOpenPopover, onClosePopover, isOpenPopover } = useDisclosure()
	// handle changes
	const [refreshKeyRequests, setRefreshKeyRequests] = useState(0);

	const handleRequestAdd = (newRequest) => {
		toast({
			title: "Request added",
			description: "Request added successfully",
			status: "success",
			duration: 3000,
		})
		// setRequests([...requests, newRequest]);

		setRefreshKeyRequests(prevKey => prevKey + 1);
	};

	return (
		<Center flex={1}>
			{userContext.user ? "" : <Navigate replace to="/" />}
			{userContext.user.admin === true ? "" : <Navigate replace to="/" />}
			<Box w={isOpen ? "70%" : "50%"} h="70%" display="flex" flexDirection={"row"}>
				<Box marginRight={"10px"} borderRadius={"25"} padding={0} boxShadow={"10px 15px 20px rgba(0, 0, 0, 0.1)"} width={"100%"} as={Card} height="100%" bgColor={colorMode === "light" ? "gray.100" : "blue.800"} overflow="auto"
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
							// bgColor="gray.100"
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
										<RequestPackager onRequestAdd={handleRequestAdd}/>
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
									<AdminShowPackagers/>
								</Box>
							</TabPanel>
						</TabPanels>

					</Tabs>
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