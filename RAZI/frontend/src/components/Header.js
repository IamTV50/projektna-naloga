import React from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom";
import {Button, ButtonGroup, Spacer, useColorMode} from "@chakra-ui/react";

function Header(props) {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <header>
            <h1>{props.title}</h1>
            <nav>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <Button size='sm' onClick={toggleColorMode}>
                        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
                    </Button>
                    <UserContext.Consumer>
                        {context => (
                            context.user ?
                                <>
                                    {/*<ButtonGroup>*/}

                                    {/*</ButtonGroup>*/}
                                    {/*<Spacer />*/}
                                    {/*<ButtonGroup>*/}
                                    {/*    <Button>Admin Panel</Button>*/}
                                    {/*</ButtonGroup>*/}
									{context.user.admin && (
										<li><Link to="/admin">Admin</Link> </li>
									)}
                                    <li><Link to='/my-packagers'>Moji paketniki</Link></li>
                                    <li><Link to='/profile'>Profile</Link></li>
                                    <li><Link to='/logout'>Logout</Link></li>
                                </>
                                :
                                <>
                                    <li><Link to='/login'>Login</Link></li>
                                    <li><Link to='/register'>Register</Link></li>
                                </>

                        )}
                    </UserContext.Consumer>
                </ul>
            </nav>
        </header >
    );
}

export default Header;