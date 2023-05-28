import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import {
    AlertDialog, AlertDialogBody,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Card,
    CardBody, CardFooter, CardHeader, Center, Heading, Text, useDisclosure,
    VStack
} from "@chakra-ui/react";
import {hover} from "@testing-library/user-event/dist/hover";

function Profile() {
    const userContext = useContext(UserContext);
    const [profile, setProfile] = useState({});

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    useEffect(function() {
        const getProfile = async function(){
            const res = await fetch("http://localhost:3001/users/profile", {credentials: "include"});
            const data = await res.json();
            setProfile(data);
        }
        getProfile();
    }, []);

    const deleteProfile = () => {
        fetch(`http://localhost:3001/users`, {
            method: "DELETE",
            credentials: "include",
        }).then((res) => {
            userContext.setUserContext(null);
            window.location.href="/";
        }).catch((err) => {
            console.log("Error deleting user", err);
        });
    };

    return (
        <Center flex={1}>
            {userContext.user ? "" : <Navigate replace to="/" />}
            <Card alignItems={"center"} paddingX={"6%"} paddingTop={4} borderRadius={"25"} variant={"elevated"} boxShadow={"10px 15px 20px rgba(0, 0, 0, 0.1)"}>
                <CardHeader>
                    <Heading >My profile</Heading>
                </CardHeader>
                <CardBody>
                    <Text>Username: {profile.username}</Text>
                    <Text>Email: {profile.email}</Text>
                </CardBody>
                <CardFooter>
                    <Button colorScheme="red" onClick={onOpen}>Delete Profile</Button>
                </CardFooter>

            </Card>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Profile
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button colorScheme={"blue"} ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme={"red"} onClick={deleteProfile} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Center>
    );
}

export default Profile;