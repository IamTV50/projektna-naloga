import React, { useState } from 'react';
import {
    Alert,
    AlertIcon, Box,
    Button, Card,
    Center, Heading,
    Input,
    InputGroup,
    InputRightElement, useColorMode,
    VStack
} from "@chakra-ui/react";

function Register() {
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [email, setEmail] = useState([]);
    const [error, setError] = useState("");
    const { colorMode, toggleColorMode } = useColorMode()

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
            <Card alignItems={"center"} paddingX={"6%"} paddingTop={4} borderRadius={"25"} variant={"elevated"} bgColor={colorMode === "light" ? "gray.100" : "gray.700"} boxShadow={"10px 15px 20px rgba(0, 0, 0, 0.1)"} p={12}>
            <VStack as="form" onSubmit={Register} >
                <Heading mb={4}>Register</Heading>
                <Input type="text" name="email" placeholder="Email" value={email} onChange={(e)=>(setEmail(e.target.value))} />
                <Box h={0}/>
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
                        <Button variant={"solid"} color={"white"} bgColor={"gray.400"} _hover={{bgColor: "gray.500"}} h='1.75rem' right={1} top={2} onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <Button type="submit" colorScheme={"blue"} isLoading={isLoading} loadingText="Registering..." onClick={Register}>Register</Button>

                {error ? <Alert status="error">
                    <AlertIcon />
                    {error}
                </Alert> : ""}
            </VStack>
            </Card>
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