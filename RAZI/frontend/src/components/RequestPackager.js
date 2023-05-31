//import React, {useContext, useState} from 'react'
import React, {useState} from 'react'
import { useCollapse } from 'react-collapsed'
import {
    Alert, AlertIcon, Box,
    Button, ButtonGroup,
    Card,
    CardBody,
    Collapse, FormControl, FormLabel, Heading, HStack, Input,
    NumberInput,
    NumberInputField, Select, Switch, Text,
    Textarea,
    useToast, VStack
} from "@chakra-ui/react";
//import {UserContext} from "../userContext";

function RequestPackager({ onRequestAdd }) {
    const toast = useToast()
    const toastIdRef = React.useRef()
    //const userContext = useContext(UserContext);
    const [isExpanded, setExpanded] = useState(false)
    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })
    const [reasonText, setReasonText] = useState('');
    const [packagerNumber, setPackagerNumber] = useState(0);
    const [error, setError] = useState("");

    const handleReasonChange = (e) => {
        setReasonText(e.target.value);
    };

    const handlePackagerNumberChange = (e) => {
        setPackagerNumber(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        submitRequest(reasonText, packagerNumber);
        setReasonText('');
        setPackagerNumber(0)
    };

    const submitRequest = ( reasonText, packagerNumber ) => {
        console.log("submitRequest")
        console.log(reasonText, packagerNumber);
        fetch(`${process.env.REACT_APP_API_URL}/requests/userRequestPackage`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: reasonText, packagerNumber: packagerNumber }),
        })
            .then((res) => {
                if (res.status !== 201) {
                    throw new Error(res.message);
                }
                return res.json()
            })
            .then((data) => {
                console.log("data");
                console.log(data);
                onRequestAdd(data);
            })
            .catch((err) => {
                toast({
                    title: "Napaka",
                    description: "Napaka pri dodanju zahteve za paketnik.",
                    status: "error",
                    duration: 3000,
                })
                setError(err.message);
            });
    };

    return (
        // <Card variant="elevated" bg="gray.300" display="inline-block" my={2}>
        //     <CardBody>
        <VStack alignItems="flex-start">
            <HStack>
                <Heading size="md">Request Packager:</Heading>
            </HStack>
            <FormControl>
                <form onSubmit={handleSubmit}>
                    <FormLabel htmlFor='packagerNumber' mb='0'>
                        Packager number:
                    </FormLabel>
                    <NumberInput mt={2} value={packagerNumber} onChange={(valueString) => setPackagerNumber(Number(valueString))}>
                        <NumberInputField border={"1px solid gray"} id='packagerNumber' type="text" name="packagerNumber" />
                    </NumberInput>
                    <FormLabel mb='0'>
                        <Text paddingTop={4}>Note:</Text>
                    </FormLabel>
                    <Textarea mt={-2} border={"1px solid gray"} value={reasonText} onChange={handleReasonChange} name="reason" />

                    <Button my={5} colorScheme={"blue"} type="submit" name="submit">Add</Button>
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
        // <Box>
        //     <form onSubmit={handleSubmit}>
        //         <FormLabel htmlFor='packagerNumber' mb='0'>
        //             Packager number:
        //         </FormLabel>
        //         <NumberInput value={packagerNumber} onChange={(valueString) => setPackagerNumber(Number(valueString))}>
        //             <NumberInputField id='packagerNumber' type="text" name="packagerNumber" />
        //         </NumberInput>
        //         {/*<Input border={"1px solid gray"} type={"number"} value={packagerNumber} onChange={handlePackagerNumberChange} name="packagerNumber"></Input>*/}
        //         <Text paddingTop={4}>Razlog:</Text>
        //         <Textarea border={"1px solid gray"} value={reasonText} onChange={handleReasonChange} name="reason" />
        //         <ButtonGroup mt={5}>
        //             <Button type="submit" colorScheme={"green"} name="submit" value="Submit">Submit</Button>
        //         </ButtonGroup>
        //     </form>
        // </Box>
        //     </CardBody>
        //
        // </Card>
        // <Box w={"100%"}>
        //     <Button variant="blue"
        //         {...getToggleProps({
        //             onClick: () => setExpanded((prevExpanded) => !prevExpanded),
        //         })}
        //     >
        //         {isExpanded ? 'Pridobi paketnik' : 'Pridobi paketnik'}
        //     </Button>
        //     <Collapse in={isExpanded}>
        //         <Card variant="elevated" bg="gray.300" display="inline-block" my={2}>
        //         <CardBody>
        //             <form onSubmit={handleSubmit}>
        //                 <Text>Številka paketnika: </Text>
        //                 <NumberInput value={packagerNumber} onChange={(valueString) => setPackagerNumber(Number(valueString))}>
		//     				   <NumberInputField border="2px solid white" _hover={{ border: "2px solid gray"}} type="text" name="packagerNumber" />
		// 				   </NumberInput>
        //                 <Text paddingTop={4}>Razlog:</Text>
        //                 <Textarea border="2px solid white" _hover={{ border: "2px solid gray"}} value={reasonText} onChange={handleReasonChange} name="reason" />
        //
        //                 <Button mt={6} type="submit" variant="blue" name="submit" value="Submit">Submit</Button>
        //             </form>
        //         </CardBody>
        //
        //         </Card>
        //
        //     </Collapse>
        // </Box>
    )
}

export default RequestPackager;