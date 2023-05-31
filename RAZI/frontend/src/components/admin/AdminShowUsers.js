import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { Link } from 'react-router-dom';
import {
	Badge, Box,
	Button,
	Card,
	CardBody,
	Collapse,
	Heading,
	HStack,
	Icon,
	IconButton,
	Input,
	Text, useColorMode, useToast,
	VStack
} from "@chakra-ui/react";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import AdminGetRequest from "./AdminGetRequest";
import {useCollapse} from "react-collapsed";

function AdminShowUsers({ onRequestDeleted }){
	const toast = useToast()
	const [users, setUsers] = useState({})
	const [isLoading, setIsLoading] = useState(true);
	const [deletedUser, setDeletedUser] = useState(null);
	const [searchName, setSearchName] = useState("");
	const [searchEmail, setSearchEmail] = useState("");
	const [searchedUsers, setSearchedUsers] = useState([]);
	const [isExpanded, setExpanded] = useState(false)
	const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })
	const { colorMode, toggleColorMode } = useColorMode()

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
					credentials: "include"
				})
				const data = await res.json();
				setUsers(data);
				setIsLoading(false);
			} catch (error) {
				console.log(error)
			}
		};

		fetchRequests();
	}, [ deletedUser ])

	const deleteUser = (uid) => {
        confirmAlert({
            title: 'Confirm user deletion',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        fetch(`${process.env.REACT_APP_API_URL}/users/${uid}`, {
                            method: "DELETE",
                            credentials: "include",
                        }).then((res) => {
                            setDeletedUser(uid)
							onRequestDeleted(uid)
							handleResetSearch()
                        }).catch((err) => {
                            console.log("Error deleting user", err);
                        });

                    }
                },
                {
                    label: 'No',
                }
            ]
        });
    };

	const searchUsers = () => {
		if (searchName === "" && searchEmail === "") {
			setSearchedUsers([])
			return
		}

		const filteredUsers = users.filter((user) => {
			const usernameMatch = user.username.toLowerCase().includes(searchName.toLowerCase());
			console.log(usernameMatch);
			const emailMatch = user.email.toLowerCase().includes(searchEmail.toLowerCase());
			console.log(emailMatch);
			return usernameMatch && emailMatch;
		});

		console.log(filteredUsers);
		
		if (filteredUsers.length === 0) {
			toast({
				title: "No users found",
				status: "error",
				duration: 3000,
				isClosable: true,
			})
		}

		setSearchedUsers(filteredUsers)
	};

	const handleResetSearch = () => {
		setSearchName("");
		setSearchEmail("");
		setSearchedUsers([]);
	}

	const handleNameInputChange = (e) => {
		setSearchName(e.target.value);
		if (e.target.value === "") handleResetSearch();
	}
	const handleEmailInputChange = (e) => { setSearchEmail(e.target.value); }

	return (
		<Box flex={1} w="100%" h="100%" overflowY="auto">
				<div>
					<form onSubmit={searchUsers} onSubmitCapture={(e) => e.preventDefault()}>
						<Input type="text" placeholder="Search by name" value={searchName} onChange={handleNameInputChange} mb={4}/>
						<Input type="text" placeholder="Search by email" value={searchEmail} onChange={handleEmailInputChange} mb={4}/>
						<Button colorScheme={"blue"} type={"submit"} onClick={() => searchUsers()}>Search</Button>
					</form>
					{/*{ searchedUsers.length > 0 ? <Button variant="blue" mx={2} onClick={() => handleResetSearch()}>Reset</Button> : "" }*/}
					<Box h={4}/>
					{isLoading
						? ""
						: searchedUsers.length > 0
						? searchedUsers.map((user) => (
							<Card key={user._id} mb={4} variant={"elevated"} bgColor={colorMode === "light" ? "gray.200" : "gray.800"}>
								<CardBody>
									<Text>{user.username}</Text>
									<Text>{user.email}</Text>
									{user.admin === true ? <Badge colorScheme="green">Admin</Badge> : <Badge colorScheme="red">User</Badge>}
									<HStack my={6}>
										<Button colorScheme={"blue"} as={Link} to='/admin/userInfo' state={ user }>Prikaži profil</Button>
										<Button colorScheme={"red"} onClick={() => deleteUser(user._id)}>Delete</Button>
									</HStack>
								</CardBody>
							</Card>
						))
						: users.map((user) => (
							<Card key={user._id} mb={4} variant={"elevated"} bgColor={colorMode === "light" ? "gray.200" : "gray.800"}>
								<CardBody>
									<Text>{user.username}</Text>
									<Text>{user.email}</Text>
									{user.admin === true ? <Badge colorScheme="green">Admin</Badge> : <Badge colorScheme="red">User</Badge>}
									<HStack my={6}>
										<Button colorScheme={"blue"} as={Link} to='/admin/userInfo' state={ user }>Prikaži profil</Button>
										<Button colorScheme={"red"} onClick={() => deleteUser(user._id)}>Delete</Button>
									</HStack>
								</CardBody>
							</Card>
						))}
				</div>
		</Box>
	 );
}
 
export default AdminShowUsers;