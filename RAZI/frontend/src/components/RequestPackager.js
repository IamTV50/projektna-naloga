//import React, {useContext, useState} from 'react'
import React, {useState} from 'react'
import { useCollapse } from 'react-collapsed'
import {
    Alert, AlertIcon,
    Button,
    Card,
    CardBody,
    Collapse,
    NumberInput,
    NumberInputField, Text,
    Textarea,
    useToast
} from "@chakra-ui/react";
//import {UserContext} from "../userContext";

function RequestPackager({ onRequestAdd }) {
    const toast = useToast()
    const toastIdRef = React.useRef()
    //const userContext = useContext(UserContext);
    const [isExpanded, setExpanded] = useState(false)
    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })
    const [reasonText, setReasonText] = useState('');
    const [packagerNumber, setPackagerNumber] = useState('');
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
        setPackagerNumber('')
    };

    const submitRequest = ( reasonText, packagerNumber ) => {
        console.log("submitRequest")
        console.log(reasonText, packagerNumber);
        fetch(`http://localhost:3001/requests/userRequestPackage`, {
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
        <div>
            <Button variant="blue"
                {...getToggleProps({
                    onClick: () => setExpanded((prevExpanded) => !prevExpanded),
                })}
            >
                {isExpanded ? 'Pridobi paketnik' : 'Pridobi paketnik'}
            </Button>
            <Collapse in={isExpanded}>
                <Card variant="elevated" bg="gray.300" display="inline-block" my={2}>
                <CardBody>
                    {/*TODO: custom box*/}
                    <form onSubmit={handleSubmit}>
                        <Text>Številka paketnika: </Text>
                        <NumberInput>
                            <NumberInputField border="2px solid white" _hover={{ border: "2px solid gray"}} value={packagerNumber} onChange={handlePackagerNumberChange} type="number" name="packagerNumber" />
                        </NumberInput>
                        <Text paddingTop={4}>Razlog:</Text>
                        <Textarea border="2px solid white" _hover={{ border: "2px solid gray"}} value={reasonText} onChange={handleReasonChange} name="reason" />

                        <Button mt={6} type="submit" variant="blue" name="submit" value="Submit">Submit</Button>
                    </form>
                </CardBody>

                </Card>

            </Collapse>
        </div>
    )
}

export default RequestPackager;