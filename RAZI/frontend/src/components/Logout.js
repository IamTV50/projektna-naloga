import React, { useEffect, useContext } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Logout() {
    const userContext = useContext(UserContext); 

    useEffect(function() {
        const logout = async function(){
            userContext.setUserContext(null);
            const res = await fetch(`${process.env.REACT_APP_API_URL}/users/logout`);
			console.log(res)
        }
        logout();
    }, []);

    return (
        <Navigate replace to="/" />
    );
}

export default Logout;