import React, {useEffect, useState} from 'react'
import {
    Box,
    Center, Heading,
    Spinner,
    Text,
} from "@chakra-ui/react";
import AdminGetRequest from "./AdminGetRequest";


function AdminRequestsList() {
    const [isLoading, setIsLoading] = useState(true);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/requests`, {
                    credentials: "include"
                })
                const data = await res.json();
                console.log("requests")
                console.log(data)
                setRequests(data.filter((request) => !request.packager.owner));
            } catch (error) {
                console.log(error)
            }
            setIsLoading(false);
        }
        fetchRequests();
    }, [])

    const handleRequestDeleted = (deletedRequestId) => {
        setRequests((prevRequests) => prevRequests.filter((request) => request._id !== deletedRequestId));
    };

    return (

        <Box flex={1} w="100%" h="100%" overflowY="auto" >
            {isLoading ? (
                <Center><Spinner/></Center>
            ) : requests.length === 0 ? (
                <Center>
                    <Heading size={"md"}>No requests</Heading>
                </Center>
            ) : (
                requests.map(request => (
                    <AdminGetRequest
                        request={request}
                        key={request._id}
                        onRequestDeleted={handleRequestDeleted} />
                ))
            )}
        </Box>
    )
}

export default AdminRequestsList