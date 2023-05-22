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
    CardBody, useDisclosure,
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
        <>
            <VStack alignItems={"self-start"}>
                {!userContext.user ? <Navigate replace to="/login" /> : ""}
                <h1>Uporabniški račun</h1>
                <Card variant="elevated" bgColor="gray.300" display="inline-block" my={2} padding={4} paddingBottom={0}>
                    <CardBody >
                        <p>Username: {profile.username}</p>
                        <p>Email: {profile.email}</p>
                    </CardBody>
                </Card>
                <Button variant="red" onClick={onOpen}>Delete Profile</Button>
            </VStack>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Customer
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button variant="blue" ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button variant='red' onClick={deleteProfile} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

        </>
    );
}

export default Profile;