import React, { useState } from 'react';
import {
    Alert,
    AlertIcon, Box,
    Button,
    ButtonGroup,
    Center, Heading,
    Input,
    InputGroup,
    InputRightElement,
    VStack
} from "@chakra-ui/react";

function Register() {
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [email, setEmail] = useState([]);
    const [error, setError] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    async function Register(e) {
        e.preventDefault();
        setIsLoading(true)
        const res = await fetch("http://localhost:3001/users", {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            })
        });
        const data = await res.json();
        console.log(data);

        if (data._id !== undefined) {
            window.location.href="/login";
        } else{
            setUsername("");
            setPassword("");
            setEmail("");

			if (data.error) {
            	setError("Registration failed");
                setIsLoading(false)
			} else {
				setError(data.message);
                setIsLoading(false)
			}
        }
    }

    return(
        <Center flex={1}>
            <VStack width={{base: "100%", md: "70%", xl: "25%"}} >
                <Heading mb={4}>Register</Heading>
                <Input marginBottom={2} type="text" name="email" placeholder="Email" value={email} onChange={(e)=>(setEmail(e.target.value))} />
                <Input type="text" name="username" placeholder="Username" value={username} onChange={(e)=>(setUsername(e.target.value))}/>
                <InputGroup size='md' py={2}>
                    <Input
                        value={password}
                        onChange={(e)=>(setPassword(e.target.value))}
                        pr='4.5rem'
                        type={show ? 'text' : 'password'}
                        placeholder='Enter password'
                    />
                    <InputRightElement width='4.5rem'>
                        <Button variant={"solid"} h='1.75rem' right={1} top={2} onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <Button colorScheme={"blue"} isLoading={isLoading} onClick={Register}>Register</Button>

                {error ? <Alert status="error">
                    <AlertIcon />
                    {error}
                </Alert> : ""}
            </VStack>
        </Center>
        // <form onSubmit={Register}>
        //     <VStack width="40%" alignItems="flex-start">
        //         <InputGroup py={2}><Input type="text" name="email" placeholder="Email" value={email} onChange={(e)=>(setEmail(e.target.value))} /></InputGroup>
        //         <Input type="text" name="username" placeholder="Username" value={username} onChange={(e)=>(setUsername(e.target.value))}/>
        //         <InputGroup size='md' py={2}>
        //             <Input
        //                 value={password}
        //                 onChange={(e)=>(setPassword(e.target.value))}
        //                 pr='4.5rem'
        //                 type={show ? 'text' : 'password'}
        //                 placeholder='Enter password'
        //             />
        //             <InputRightElement width='4.5rem'>
        //                 <Button variant={"solid"} color={"white"} bgColor={"gray.400"} _hover={{bgColor: "gray.500"}} h='1.75rem' right={1} top={2} onClick={handleClick}>
        //                     {show ? 'Hide' : 'Show'}
        //                 </Button>
        //             </InputRightElement>
        //         </InputGroup>
        //         <Button variant='blue' isLoading={isLoading} type='submit'>Register</Button>
        //         {error !== "" && (
        //             <Alert status="error">
        //                 <AlertIcon/>
        //                 {error}
        //             </Alert>
        //         )}
        //
        //     </VStack>
        // </form>
    );
}

export default Register;