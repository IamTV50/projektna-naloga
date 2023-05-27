import React, { useState, useEffect } from 'react';
import Packager from "./Packager";
import { useContext } from "react";
import {UserContext} from "../userContext";
import RequestPackager from "./RequestPackager";
import {
    Box,
    Button,
    ButtonGroup,
    Card,
    Center,
    Collapse,
    Divider,
    Flex, FocusLock,
    Heading,
    HStack,
    IconButton,
    Popover,
    PopoverArrow, PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
    SimpleGrid,
    Spacer,
    Spinner,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useDisclosure,
    useToast,
    VStack,
    Wrap
} from "@chakra-ui/react";
import {Navigate} from "react-router-dom";
import { animated, useSpring } from '@react-spring/web'
import {AddIcon} from "@chakra-ui/icons";
import UnlockHistory from "./UnlockHistory";
import Request from "./Request";
import MyPackagerRequest from "./MyPackagerRequest";
import MyPackagerUsers from "./MyPackagerUsers";
import { motion } from "framer-motion";

function MyPackagers(){
    const toast = useToast()
    const userContext = useContext(UserContext);
    const [packagers, setPackagers] = useState([]);
    const [userChanges, setUserChanges] = useState(false);
    const [requests, setRequests] = useState([]);
	const [myPackagerRequests, setMyPackagerRequests] = useState([]);
	const [myPackagerUsers, setMyPackagerUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen, onToggle } = useDisclosure()
    const [selectedPackager, setSelectedPackager] = useState(null);
    const [packagerUnlocks, setPackagerUnlocks] = useState([]);

    // popover
    const { onOpenPopover, onClosePopover, isOpenPopover } = useDisclosure()
    const firstFieldRef = React.useRef(null)

    const transition = {
        type: "spring",
        duration: 0.3
    };

    const variants = {
        open: { opacity: 1, scale: 1 },
        closed: { opacity: 0, scale: 0 }
    };

    const inverseVariants = {
        open: { opacity: 0, scale: 0 },
        closed: { opacity: 1, scale: 1 }
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

    useEffect(function() {
        const getUserPackagers = async function() {
			if (userContext.user.admin) {
				const res = await fetch(`http://localhost:3001/packagers`);
				const data = await res.json();
				setIsLoading(false);
				setPackagers(data);
				console.log(data)
			} else {
				const res = await fetch(`http://localhost:3001/users/${userContext.user._id}`);
				const data = await res.json();
				setIsLoading(false);
				setPackagers(data.packagers);
				console.log(data)
			}
        }

        const getRequests = async function(){
            const res = await fetch(`http://localhost:3001/requests/user/${userContext.user._id}`);
            const data = await res.json();
            console.log(data)
            setRequests(data);
        }

		const getMyPackagerRequests = async function(){
            const res = await fetch(`http://localhost:3001/requests/`);
            const data = await res.json();

			// Filter the requests based on the condition
			const filteredRequests = data.filter(
				(request) => request.packager.owner === userContext.user._id
			);

            console.log(filteredRequests)
            setMyPackagerRequests(filteredRequests);
        }
		
		getUserPackagers();
        getRequests();
		getMyPackagerRequests();
    }, []);

	useEffect(function() {
		const getMyPackagerUsers = async function(){
			const res = await fetch(`http://localhost:3001/users/myPackagers/`, {credentials: "include"});
			const data = await res.json();

			console.log(data)
			setMyPackagerUsers(data);
		}

		getMyPackagerUsers();
    }, [userChanges]);

    const handleRequestAdd = (newRequest) => {
        toast({
            title: "Request added",
            description: "Request added successfully",
            status: "success",
            duration: 3000,
        })
        setRequests([...requests, newRequest]);
    };

    const handleRequestDelete = (requestId) => {
        console.log("Deleting request with id: " + requestId);

        try {
            fetch(`http://localhost:3001/requests/${requestId}`, {
                method: "DELETE",
                credentials: "include"
            });
            const updatedRequests = requests.filter((request) => request._id !== requestId);
            setRequests(updatedRequests);
            toast({
                title: "Request deleted",
                description: "Request deleted successfully",
                status: "success",
                duration: 3000,
            })
        } catch (error) {
            toast({
                title: "Request not deleted",
                description: "Request not deleted successfully",
                status: "error",
                duration: 3000,
            })
            console.log(error);
        }
    }

	const handleUserRequestDelete = (requestId) => {
        console.log("Deleting request with id: " + requestId);

        try {
            fetch(`http://localhost:3001/requests/${requestId}`, {
                method: "DELETE",
                credentials: "include"
            });
            const updatedRequests = myPackagerRequests.filter((request) => request._id !== requestId);
            setMyPackagerRequests(updatedRequests);
            toast({
                title: "Request deleted",
                description: "Request deleted successfully",
                status: "success",
                duration: 3000,
            })
        } catch (error) {
            toast({
                title: "Request not deleted",
                description: "Request not deleted successfully",
                status: "error",
                duration: 3000,
            })
            console.log(error);
        }
    }

	const handleUserRequestApprove = (request) => {
        console.log("Approving request with id: " + request._id);

        try {
            fetch(`http://localhost:3001/users/addPackager`, {
                method: "PUT",
				credentials: "include",
				headers: { 'Content-Type': 'application/json'},
				body: JSON.stringify({
					username: request.user.username,
					packagerNumber: request.packager.number
				})
            });
            
			handleUserRequestDelete(request._id);

            toast({
                title: "Request approved",
                description: "Request approved successfully",
                status: "success",
                duration: 3000,
            })
        } catch (error) {
            toast({
                title: "Request not approved",
                description: "Request not approved successfully",
                status: "error",
                duration: 3000,
            })
            console.log(error);
        }
    }

	const handleUserPackagerDelete = (user, packager) => {
        console.log("Deleting packager with id: " + packager._id + " from user with id: " + user._id);

        try {
            fetch(`http://localhost:3001/users/removePackager`, {
                method: "PUT",
				credentials: "include",
				headers: { 'Content-Type': 'application/json'},
				body: JSON.stringify({
					username: user.username,
					packagerNumber: packager.number
				})
            });

            setUserChanges(!userChanges);

            toast({
                title: "Packager deleted",
                description: "Packager deleted successfully",
                status: "success",
                duration: 3000,
            })
        } catch (error) {
            toast({
                title: "Packager not deleted",
                description: "Packager not deleted successfully",
                status: "error",
                duration: 3000,
            })
            console.log(error);
        }
    }

    const Form = ({ firstFieldRef, onCancel }) => {
        return (
            <Card spacing={4} p={6}>
                <RequestPackager onRequestAdd={handleRequestAdd} onCancel={onCancel} />
                <Button colorScheme={"red"} onClick={onCancel}>
                    Cancel
                </Button>
                {/*<TextInput*/}
                {/*    label='First name'*/}
                {/*    id='first-name'*/}
                {/*    ref={firstFieldRef}*/}
                {/*    defaultValue='John'*/}
                {/*/>*/}
                {/*<TextInput label='Last name' id='last-name' defaultValue='Smith' />*/}
                {/*<ButtonGroup display='flex' justifyContent='flex-end'>*/}
                {/*    <Button variant='outline' onClick={onCancel}>*/}
                {/*        Cancel*/}
                {/*    </Button>*/}
                {/*    <Button isDisabled colorScheme='teal'>*/}
                {/*        Save*/}
                {/*    </Button>*/}
                {/*</ButtonGroup>*/}
            </Card>
        )
    }

    // divider={<Divider/>} maxH={"80%"} alignItems={"flex-start"} minH={"70%"} width={{base: "100%", md: "70%", xl: "25%"}} bgColor={"gray.100"} borderRadius={"25"} padding={10} boxShadow={"10px 15px 20px rgba(0, 0, 0, 0.1)"}
    return(
        <Center flex={1}>
            {userContext.user ? "" : <Navigate replace to="/" />}
            <Box w={isOpen ? "70%" : "50%"} h="70%" display="flex" flexDirection={"row"}>
                <Box marginRight={"10px"} borderRadius={"25"} padding={0} boxShadow={"10px 15px 20px rgba(0, 0, 0, 0.1)"} width={"100%"} as={Card} height="100%" bgColor="gray.100" overflow="auto"
                     css={{
                    "&::-webkit-scrollbar": {
                        width: "0",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#888",
                    },
                    }}>
                    <Tabs isLazy>
                        <TabList
                            position="sticky"
                            top="0"
                            bgColor="gray.100"
                            zIndex="sticky"
                            p={4}
                            minWidth="100%"
                            width="fit-content"
                        >
                            <Tab>My Packagers</Tab>
                            <Tab>My Requests</Tab>
							<Tab>Approve Requests</Tab>
							{/*<Tab>My Packager Users</Tab>*/}
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
                            {/*<IconButton aria-label="Search database" position="relative" right={0} icon={<AddIcon />} />*/}
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                    <Box flex={1} w="100%" h="100%" overflowY="auto">
                                        {isLoading ? (
                                            <Center>
                                                <Spinner />
                                            </Center>
                                        ) : packagers.length === 0 ? (
                                            "No packagers"
                                        ) : (
                                            packagers.map((packager) => (
                                                <>
                                                    <Packager
                                                        packager={packager}
                                                        key={packager._id}
                                                        onToggle={() => handlePackagerClick(packager)}
                                                    />
                                                    <Divider/>
                                                </>
                                            ))
                                        )}
                                    </Box>
                            </TabPanel>
                            <TabPanel>
                                    <Box flex={1} w="100%" h="100%" overflowY="auto">
                                        {isLoading ? (
                                            <Center>
                                                <Spinner />
                                            </Center>
                                        ) : requests.length === 0 ? (
                                            "No requests"
                                        ) : (
                                            requests.map((request) => (
                                                <>
                                                    <Request key={request._id} request={request} handleDelete={handleRequestDelete}/>
                                                    <Divider my={7}/>
                                                </>
                                            ))
                                        )}
                                    </Box>
                            </TabPanel>
							<TabPanel>
                                    <Box flex={1} w="100%" h="100%" overflowY="auto">
                                        {isLoading ? (
                                            <Center>
                                                <Spinner />
                                            </Center>
                                        ) : myPackagerRequests.length === 0 ? (
                                            "No requests from other users"
                                        ) : (
                                            myPackagerRequests.map((request) => (
                                                <>
                                                    <MyPackagerRequest key={request._id} request={request} handleApprove={handleUserRequestApprove} handleDelete={handleUserRequestDelete}/>
                                                    <Divider my={7}/>
                                                </>
                                            ))
                                        )}
                                    </Box>
                            </TabPanel>
							{/*<TabPanel>
                                    <Box flex={1} w="100%" h="100%" overflowY="auto">
                                        {isLoading ? (
                                            <Center>
                                                <Spinner />
                                            </Center>
                                        ) : myPackagerUsers.length === 0 ? (
                                            "No requests from other users"
                                        ) : (
                                            myPackagerUsers.map((user) => (
                                                <>
                                                    <MyPackagerUsers key={user._id} user={user} owner={userContext.user._id} handleDelete={handleUserPackagerDelete}/>
                                                    <Divider my={7}/>
                                                </>
                                            ))
                                        )}
                                    </Box>
							</TabPanel>*/}
                        </TabPanels>
                    </Tabs>
                </Box>
                <Box marginLeft={"10px"}  w={isOpen ? "70%" : "0"} hidden={!isOpen} >
                    {/*<Collapse in={isOpen} animateOpacity>*/}
                    <Box
                        flex={1}
                        width="100%"
                        h="100%"
                        overflow="auto"
                        bgColor="gray.100"
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
                            {selectedPackager && <UnlockHistory packager={selectedPackager} unlockHistory={packagerUnlocks} />}
                        </Box>
                    {/*</Collapse>*/}
                </Box>


            </Box>
        </Center>
    );

}

export default MyPackagers;