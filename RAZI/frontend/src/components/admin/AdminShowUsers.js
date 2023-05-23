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
	Text,
	VStack
} from "@chakra-ui/react";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import AdminGetRequest from "./AdminGetRequest";
import {useCollapse} from "react-collapsed";

function AdminShowUsers({ onRequestDeleted }){
	const [users, setUsers] = useState({})
	const [isLoading, setIsLoading] = useState(true);
	const [deletedUser, setDeletedUser] = useState(null);
	const [searchName, setSearchName] = useState("");
	const [searchEmail, setSearchEmail] = useState("");
	const [searchedUsers, setSearchedUsers] = useState([]);
	const [isExpanded, setExpanded] = useState(false)
	const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const res = await fetch(`http://localhost:3001/users`, {
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
                        fetch(`http://localhost:3001/users/${uid}`, {
                            method: "DELETE",
                            credentials: "include",
                        }).then((res) => {
                            setDeletedUser(uid)
							onRequestDeleted(uid)
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
			alert("0 users have that name or email");
		}

		setSearchedUsers(filteredUsers)
	};

	const handleResetSearch = () => {
		setSearchName("");
		setSearchEmail("");
		setSearchedUsers([]);
		document.getElementById('userNameSearch_input').value = ""
		document.getElementById('userEmailSearch_input').value = ""
	}

	const handleNameInputChange = (e) => { setSearchName(e.target.value); }
	const handleEmailInputChange = (e) => { setSearchEmail(e.target.value); }

	return (
		<VStack alignItems="flex-start">
			<HStack>
				<Heading size="sl">Uporabniki</Heading>
				<IconButton variant="blue"
							icon={<Icon as={isExpanded ? ChevronUpIcon : ChevronDownIcon} boxSize={6} />}
							{...getToggleProps({
								onClick: () => setExpanded((prevExpanded) => !prevExpanded),
							})}>
				</IconButton>
			</HStack>

			<Collapse in={isExpanded}>
				<div>

					<Input type="text" placeholder="Search by name" onChange={handleNameInputChange} mb={4}/>
					<Input type="text" placeholder="Search by email" onChange={handleEmailInputChange} mb={4}/>
					<Button variant="blue" onClick={() => searchUsers()}>Search</Button>
					{/*{ searchedUsers.length > 0 ? <Button variant="blue" mx={2} onClick={() => handleResetSearch()}>Reset</Button> : "" }*/}
					<Box h={4}/>
					{isLoading
						? ""
						: searchedUsers.length > 0
						? searchedUsers.map((user) => (
								<Card key={user._id} mb={4} variant={"elevated"} backgroundColor={"gray.300"}>
									<CardBody>
										<Text>{user.username}</Text>
										<Text>{user.email}</Text>
										{user.admin === true ? <Badge colorScheme="green">Admin</Badge> : <Badge colorScheme="red">User</Badge>}
										<HStack my={6}>
											<Button variant="blue" as={Link} to='/admin/userInfo' state={ user }>Prikaži profil</Button>
											<Button variant="red" onClick={() => deleteUser(user._id)}>Delete</Button>
										</HStack>
									</CardBody>
								</Card>
						))
						: users.map((user) => (
							<Card key={user._id} mb={4} variant={"elevated"} backgroundColor={"gray.300"}>
								<CardBody>
									<Text>{user.username}</Text>
									<Text>{user.email}</Text>
									{user.admin === true ? <Badge colorScheme="green">Admin</Badge> : <Badge colorScheme="red">User</Badge>}
									<HStack my={6}>
										<Button variant="blue" as={Link} to='/admin/userInfo' state={ user }>Prikaži profil</Button>
										<Button variant="red" onClick={() => deleteUser(user._id)}>Delete</Button>
									</HStack>
								</CardBody>
							</Card>
						))}
				</div>
			</Collapse>
		</VStack>
		// <div>
		//
		// 	<input type='text' id='userNameSearch_input' placeholder='search by name' onChange={handleNameInputChange}/> <br/>
		// 	<input type='text' id='userEmailSearch_input' placeholder='search by email' onChange={handleEmailInputChange}/> <br/>
		// 	<button onClick={() => searchUsers()}>search</button>
		// 	{ searchedUsers.length > 0 ? <button onClick={() => handleResetSearch()}>reset</button> : "" }
		// 	<br/>
		// 	<ul>
		// 		{isLoading
		// 			? ""
		// 			: searchedUsers.length > 0
		// 			? searchedUsers.map((user) => (
		// 				<li key={user._id}>
		// 				<span>{user.username} </span>
		// 				<span> {user.email}</span>
		// 				<button onClick={() => deleteUser(user._id)}>delete user</button>
		// 				<Link to='/admin/userInfo' state={ user }>
		// 					<button>show user profile</button>
		// 				</Link>
		// 				</li>
		// 			))
		// 			: users.map((user) => (
		// 				<li key={user._id}>
		// 				<span>{user.username} </span>
		// 				<span> {user.email}</span>
		// 				<button onClick={() => deleteUser(user._id)}>delete user</button>
		// 				<Link to='/admin/userInfo' state={ user }>
		// 					<button>show user profile</button>
		// 				</Link>
		// 				</li>
		// 			))}
		// 	</ul>
		// </div>
	 );
}
 
export default AdminShowUsers;