import React, { useState, useEffect } from 'react';
import Packager from "./Packager";
import { useContext } from "react";
import {UserContext} from "../userContext";
import RequestPackager from "./RequestPackager";

function MyPackagers(){
    const userContext = useContext(UserContext);
    const [packagers, setPackagers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(function() {
        const getUser = async function() {
			if (userContext.user.admin) {
				const res = await fetch(`http://localhost:3001/packagers`);
				const data = await res.json();
				setIsLoading(false);
				setPackagers(data);
				console.log(data)
			} else {
				const res = await fetch(`http://localhost:3001/users/${userContext.user._id}`);
				const data = await res.json();
				setIsLoading(false);
				setPackagers(data.packagers);
				console.log(data)
			}
        }
        getUser();
    }, []);

    const handleRequestAdd = (newRequest) => {
        // setUser((prevUser) => ({
        //     ...prevUser,
        //     comments: [...prevUser.comments, newRequest],
        // }));
    };

    return(
        <div>
            <h3>My packagers:</h3>
            <ul>
                {isLoading ? "" : packagers.length === 0 ? "Ni paketnikov" : packagers.map(packager => (
                    <Packager packager={packager} key={packager._id}></Packager>
                ))}
            </ul>
            <RequestPackager onRequestAdd={handleRequestAdd}></RequestPackager>
        </div>
    );
}

export default MyPackagers;