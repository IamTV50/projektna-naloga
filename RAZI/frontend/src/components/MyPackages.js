import { useState, useEffect } from 'react';
import Package from "./Package";
import { useContext } from "react";
import {UserContext} from "../userContext";

function MyPackages(){
    const userContext = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(function(){
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
            <h3>My packages:</h3>
            <ul>
                {isLoading ? "" : user.packages.map(packager=>(
                    // <Link to={`/pack/${photo._id}`} style={{ color: 'black', textDecoration: 'none' }}>
                        <Package packager={packager} key={packager._id}></Package>
                    // </Link>
                ))}
            </ul>
        </div>
    );
}

export default MyPackages;