import React, { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import {Link, Navigate} from 'react-router-dom';
import {
    Alert,
    AlertIcon,
    Button,
    ButtonGroup, Card, Center, Heading,
    HStack,
    Input,
    InputGroup,
    InputRightElement, useColorMode,
    VStack
} from '@chakra-ui/react'

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const { colorMode, toggleColorMode } = useColorMode()

    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    async function Login(e) {
        e.preventDefault();
        setIsLoading(true)
        const res = await fetch("http://localhost:3001/users/login", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await res.json();
        console.log(data);

        if (data._id !== undefined) {
            // console.log("setting user context")
            userContext.setUserContext(data);
            setIsLoading(false)
        } else {
            console.log("invalid username or password")
            setUsername("");
            setPassword("");
            setError("Invalid username or password");
            setIsLoading(false)
        }
    }

    return (
        <Center flex={1}>
            <Card alignItems={"center"} paddingX={"6%"} paddingTop={4} borderRadius={"25"} variant={"elevated"} bgColor={colorMode === "light" ? "gray.100" : "gray.700"} boxShadow={"10px 15px 20px rgba(0, 0, 0, 0.1)"} p={12}>
            <VStack as="form" onSubmit={Login}>
                {userContext.user ? <Navigate replace to="/" /> : ""}
                <Heading mb={4}>Login</Heading>
                <Input type="text" name="username" placeholder="Username"
                          value={username} onChange={(e)=>(setUsername(e.target.value))}/>
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
                <ButtonGroup size='md' py={2}>
                    <Button type="submit" colorScheme={"green"} isLoading={isLoading} loadingText="Logging in..." onClick={Login}>Login</Button>
                    {/*<Button as={Link} to='/register'>Register</Button>*/}
                </ButtonGroup>
                {error ? <Alert status="error">
                    <AlertIcon />
                    {error}
                </Alert> : ""}
            </VStack>
            </Card>
        </Center>
    );
}

export default Login;