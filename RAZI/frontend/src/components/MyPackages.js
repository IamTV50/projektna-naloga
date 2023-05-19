import React, { useState, useEffect } from 'react';
import Package from "./Package";
import { useContext } from "react";
import {UserContext} from "../userContext";

function MyPackages(){
    const userContext = useContext(UserContext);
    const [packages, setPackages] = useState([]);
    useEffect(function(){
        const getPackages = async function(){
            const res = await fetch(`http://localhost:3001/packages/user/${userContext.user._id}`);
            const data = await res.json();
            setPackages(data);
        }
        getPackages();
    }, []);

    return(
        <div>
            <h3>My packages:</h3>
            <ul>
                {packages.map(packager=>(
                    // <Link to={`/pack/${photo._id}`} style={{ color: 'black', textDecoration: 'none' }}>
                        <Package packager={packager} key={packager._id}></Package>
                    // </Link>
                ))}
            </ul>
        </div>
    );
}

export default MyPackages;