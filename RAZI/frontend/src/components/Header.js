import React from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom";
import {Button, ButtonGroup, HStack, IconButton, Spacer, useColorMode, useColorModeValue} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

function Header(props) {

    const { colorMode, toggleColorMode } = useColorMode()
    const color = useColorModeValue('white', `gray.800`)
    return (
        <header>
            <HStack paddingBottom={8}>
                <ButtonGroup>
                    <Button variant='header' as={Link} to='/'>Home</Button>
                    <UserContext.Consumer>
                        {context => (
                            context.user ?
                                <>
                                <Button variant='header' as={Link} to='/my-packagers'>My Packagers</Button>
                                <Button variant='header' as={Link} to='/profile'>Profile</Button>
                                <Button variant='header' as={Link} to='/logout'>Logout</Button>
                                </>
                                :
                                <>
                                <Button variant='header' as={Link} to='/login'>Login</Button>
                                <Button variant='header' as={Link} to='/register'>Register</Button>
                                </>
                        )}
                    </UserContext.Consumer>
                </ButtonGroup>
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



            </HStack>
        </header >
    );
}

export default Header;