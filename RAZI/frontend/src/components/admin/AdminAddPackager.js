import React, { useState } from "react";
import {
    Alert, AlertIcon, Box,
    Button, Collapse,
    FormControl,
    FormLabel,
    Heading,
    HStack, Icon, IconButton,
    NumberInput,
    NumberInputField,
    Switch,
    VStack
} from "@chakra-ui/react";
import {useCollapse} from "react-collapsed";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

function AdminAddPackager() {
	const [number, setNumber] = useState(0);
	const [publicPackager, setPublicPackager] = useState(true);
    const [error, setError] = useState("");
    const [isExpanded, setExpanded] = useState(false)
    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })

    async function AddPackager(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:3001/packagers", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                number: number,
                public: publicPackager
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
        <Heading size="sl">Dodaj paketnik</Heading>
        <IconButton variant="blue"
                    icon={<Icon as={isExpanded ? ChevronUpIcon : ChevronDownIcon} boxSize={6} />}
                {...getToggleProps({
                    onClick: () => setExpanded((prevExpanded) => !prevExpanded),
                })}>
        </IconButton>
        </HStack>
        <Collapse in={isExpanded}>
        <FormControl>
		<form onSubmit={AddPackager}>
            <HStack>
                <FormLabel htmlFor='packagerNumber' mb='0'>
                    Številka paketnika:
                </FormLabel>
                <NumberInput value={number} onChange={(valueString) => setNumber(Number(valueString))}>
                    <NumberInputField id='packagerNumber' border="2px solid gray" _hover={{ border: "2px solid blue"}} type="text" name="packagerNumber" />
                </NumberInput>
            </HStack>
            <HStack py={4}>
            <FormLabel htmlFor='publicPackager' mb='0'>
                Public:
            </FormLabel>
            <Switch id='publicPackager' isChecked={publicPackager} onChange={(e) => setPublicPackager(e.target.checked)} />
            </HStack>
            <Button variant="blue" type="submit" name="submit">Dodaj</Button>
            <Box h={4}/>
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
        </Collapse>
        </VStack>
	);
}
 
export default AdminAddPackager;