import React from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom";
import {
    Button,
    ButtonGroup,
    Flex,
    HStack,
    IconButton,
    Spacer,
    Stack,
    useColorMode,
    useColorModeValue
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

function Header(props) {

    const { colorMode, toggleColorMode } = useColorMode()
    const color = useColorModeValue('white', `gray.800`)
    return (
        <Flex as="nav" wrap={"wrap"} justify={"space-between"} paddingBottom={8}>
            {/*<HStack paddingBottom={8}>*/}
            <Stack direction={["column", "row"]} spacing={4}>
                    <Button as={Link} to='/'>Home</Button>
                    <UserContext.Consumer>
                        {context => (
                            context.user ?
                                <>
                                <Button as={Link} to='/my-packagers'>My Packagers</Button>
                                <Button as={Link} to='/profile'>Profile</Button>
                                <Button as={Link} to='/logout'>Logout</Button>
                                </>
                                :
                                <>
                                <Button as={Link} to='/login'>Login</Button>
                                <Button as={Link} to='/register'>Register</Button>
                                </>
                        )}
                    </UserContext.Consumer>
            </Stack>
                <Spacer/>
                <UserContext.Consumer>
                    {context => (
                        context.user ?
                            <>
                                {context.user.admin ? (
                                    <ButtonGroup isAttached={true} variant='outline'>
                                        <Button variant='admin' as={Link} to='/admin'>Admin</Button>
                                        <IconButton
                                            variant="admin_icon"
                                            aria-label="Toggle color mode"
                                            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                                            onClick={toggleColorMode}
                                        />
                                    </ButtonGroup>
                                ) : (
                                    <IconButton
                                        variant="header"
                                        aria-label="Toggle color mode"
                                        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                                        onClick={toggleColorMode}
                                    />
                                )}
                            </>
                            :
                            <><IconButton
                                variant="header"
                                aria-label="Toggle color mode"
                                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                                onClick={toggleColorMode}
                            /></>
                    )}
                </UserContext.Consumer>



            {/*</HStack>*/}
        </Flex >
    );
}

export default Header;