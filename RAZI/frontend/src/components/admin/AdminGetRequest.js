import React, { useState } from "react";
import { confirmAlert } from 'react-confirm-alert';
import {
	Alert,
	AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader,
	AlertDialogOverlay,
	AlertIcon, Badge,
	Button,
	Card,
	HStack, Spacer,
	Text,
	useDisclosure
} from "@chakra-ui/react";

function AdminGetRequest({ request, onRequestDeleted }) {
    const [error, setError] = useState("");

	// Alert dialog
	const { isOpen, onOpen, onClose } = useDisclosure()
	const cancelRef = React.useRef()

	const [isAccept, setIsAccept] = useState(false);

	const AcceptRequest = () => {
		setIsAccept(true);
		onOpen();
	}

	const DeleteRequest = () => {
		setIsAccept(false);
		onOpen();
	}

	const acceptRequest = () => {
		fetch(`http://localhost:3001/users/addPackager`, {
			method: "PUT",
			credentials: "include",
			headers: { 'Content-Type': 'application/json'},
			body: JSON.stringify({
				username: request.user.username,
				packagerNumber: request.packager.number
			})
		}).then((res) => res.json())
		.then((data) => {
			if (data.message) {
				setError(data.message);
			}

			if (!data.error) {
				Delete();
			}
		})
		.catch((err) => {
			console.log("Error adding packager to user", err);
			setError("Error occurred while accepting the request!");
		});
    }

	const Delete = async () => {
		try {
			const response = await fetch(`http://localhost:3001/requests/${request._id}`, {
				method: "DELETE",
				credentials: "include",
			});
		
			if (response.status === 204) {
				onRequestDeleted(request._id);
				onClose();
			} else {
				setError("Error occurred while deleting the request!");
			}
		} catch (err) {
			console.log("Error deleting request", err);
			setError("Error occurred while deleting the request!");
		}
	};


    return (
        <>
			{!request.packager.owner && (
				<Card variant={"elevated"} backgroundColor={"gray.300"} mb={5} p={5}>
					<HStack>
						<Text>Request by: {request.user ? request.user.username : "[deleted]"}</Text>
						<Spacer/>
						<Text>{new Date(request.created).toLocaleString("de-DE")}</Text>

					</HStack>


					<Text>Packager: <Badge colorScheme={"blue"} fontSize='1.1em'>{request.packager ? request.packager.number : "[deleted]"}</Badge></Text>
					<Text>Description: {request.reason}</Text>

					<HStack>
						<Button colorScheme="green" onClick={AcceptRequest}>Accept</Button>
						<Button colorScheme="red" onClick={DeleteRequest}>Delete</Button>
					</HStack>
					{error !== "" && (
						<Alert status="error">
							<AlertIcon/>
							{error}
						</Alert>
					)}
				</Card>
			)}
			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
				isCentered>
				<AlertDialogOverlay>
					<AlertDialogContent>
						{isAccept ? (
							<AlertDialogHeader fontSize='lg' fontWeight='bold'>
								Accept Request
							</AlertDialogHeader>
						) : (
							<AlertDialogHeader fontSize='lg' fontWeight='bold'>
								Delete Request
							</AlertDialogHeader>
						)}

						<AlertDialogBody>
							Are you sure? You can't undo this action afterwards.
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button colorScheme={"blue"} ref={cancelRef} onClick={onClose}>
								Cancel
							</Button>
							{isAccept ? (
								<Button colorScheme={"green"} onClick={acceptRequest} ml={3}>
									Accept
								</Button>
							) : (
								<Button colorScheme={"red"} onClick={Delete} ml={3}>
									Delete
								</Button>
							)}
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>

		</>
    );
}
 
export default AdminGetRequest;