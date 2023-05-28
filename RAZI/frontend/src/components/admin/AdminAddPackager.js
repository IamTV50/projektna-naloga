import React, {useEffect, useState} from "react";
import {
    Alert, AlertIcon, Box,
    Button, Collapse,
    FormControl,
    FormLabel,
    Heading,
    HStack, Icon, IconButton,
    NumberInput,
    NumberInputField, Select,
    Switch,
    VStack
} from "@chakra-ui/react";
import {useCollapse} from "react-collapsed";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

function AdminAddPackager() {
	const [number, setNumber] = useState("");
	const [publicPackager, setPublicPackager] = useState(true);
    const [error, setError] = useState("");
    const [isExpanded, setExpanded] = useState(false)
    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");

    useEffect(() => {
        // Fetch all users
        async function fetchUsers() {
            try {
                const res = await fetch("http://localhost:3001/users");
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchUsers();
    }, []);

    async function AddPackager(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:3001/packagers", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                number: number,
                public: publicPackager,
                owner: publicPackager ? null : selectedUser
            })
        });
        const data = await res.json();
        console.log(data);

		setNumber(0);
		setPublicPackager(true);

        if (data._id === undefined) {
            setError(data.message);
        }
    }

	return (
        <VStack alignItems="flex-start">
        <HStack>
        <Heading size="sl">Add Packager:</Heading>
        </HStack>
        <FormControl>
		<form onSubmit={AddPackager}>

            <FormLabel htmlFor='packagerNumber' mb='0'>
                Packager number:
            </FormLabel>
            <NumberInput value={number} onChange={(valueString) => setNumber(Number(valueString))}>
                <NumberInputField id='packagerNumber' type="text" name="packagerNumber" />
            </NumberInput>
            <HStack py={4}>
            <FormLabel htmlFor='publicPackager' mb='0'>
                Public:
            </FormLabel>
            <Switch id='publicPackager' isChecked={publicPackager} onChange={(e) => setPublicPackager(e.target.checked)} />
            </HStack>
            {!publicPackager && (
                <Select placeholder="Select user"
                        onChange={(e) => setSelectedUser(e.target.value)}
                        value={selectedUser}>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>{user.username}</option>
                    ))}

                </Select>
            )}
            <Button my={4} colorScheme={"blue"} type="submit" name="submit">Add</Button>
            {error !== "" && (
                <>
                <Alert status="error">
                    <AlertIcon/>
                    {error}
                </Alert>
                <Box h={4}/>

                </>
            )}
        </form>
        </FormControl>
        </VStack>
	);
}

export default AdminAddPackager;