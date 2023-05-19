import { useState, useEffect } from 'react';
import Packager from "./Packager";
import { useContext } from "react";
import {UserContext} from "../userContext";

function MyPackagers(){
    const userContext = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(function() {
        const getUser = async function(){
            const res = await fetch(`http://localhost:3001/users/${userContext.user._id}`);
            const data = await res.json();
            setIsLoading(false);
            setUser(data);
        }
        getUser();
    }, []);

    return(
        <div>
            <h3>My packagers:</h3>
            <ul>
                {isLoading ? "" : user.packagers.map(packager => (
                    <Packager packager={packager} key={packager._id}></Packager>
                ))}
            </ul>
        </div>
    );
}

export default MyPackagers;