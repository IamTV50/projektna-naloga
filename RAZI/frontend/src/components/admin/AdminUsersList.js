import React, {useEffect, useState} from 'react'
import {
    Box,
    Card,
    CardBody,
    Center,
    Collapse,
    Heading,
    HStack,
    Icon,
    IconButton,
    Spinner,
    Text,
    VStack
} from "@chakra-ui/react";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {useCollapse} from "react-collapsed";
import AdminGetRequest from "./AdminGetRequest";


function AdminUsersList() {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`http://localhost:3001/requests`, {
                    credentials: "include"
                })
                const data = await res.json();
                console.log("requests")
                console.log(data)
                // setRequests(data.filter((request) => !request.packager.owner));
            } catch (error) {
                console.log(error)
            }
            setIsLoading(false);
        }
        fetchUsers();
    }, [])

    return (
        <Box flex={1} w="100%" h="100%" overflowY="auto">
            {isLoading ? (
                <Center><Spinner/></Center>
            ) : users.length === 0 ? (
                <Center>
                    <Text fontSize="xl">No requests</Text>
                </Center>
            ) : (
                users.map(user => (
                    <Text/>

                ))
            )}
        </Box>
    )
}

export default AdminUsersList