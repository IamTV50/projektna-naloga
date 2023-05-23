import React, { useState, useEffect } from 'react';
import Packager from "./Packager";
import { useContext } from "react";
import {UserContext} from "../userContext";
import RequestPackager from "./RequestPackager";
import {useToast} from "@chakra-ui/react";

function MyPackagers(){
    const toast = useToast()
    const userContext = useContext(UserContext);
    const [packagers, setPackagers] = useState([]);
    const [user, setUser] = useState(null);
    const [requests, setRequests] = useState([]);
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

    useEffect(function() {
        const getRequests = async function(){
            const res = await fetch(`http://localhost:3001/requests/user/${userContext.user._id}`);
            const data = await res.json();
            console.log(data)
            setRequests(data);
        }
        getRequests();
    }, []);

    const handleRequestAdd = (newRequest) => {
        toast({
            title: "Request added",
            description: "Request added successfully",
            status: "success",
            duration: 3000,
        })
        setRequests([...requests, newRequest]);
    };

    return(
        <div>
            <h3>My packagers:</h3>
            <ul>
                {isLoading ? "" : packagers.length === 0 ? "Ni paketnikov" : packagers.map(packager => (
                    <Packager packager={packager} key={packager._id}></Packager>
                ))}
            </ul>
            <h3>My requests:</h3>
            <ul>
                {isLoading ? "" : requests.length === 0 ? "Ni zahtevkov" : requests.map(request => (
                    <div key={request._id}>
                        <h5>Packager number: {request.packager.number}</h5>
                        <p>Reason: {request.reason}</p>
                        <p>Date: {new Date(request.created).toLocaleString("de-DE")}</p>
                        <p>Public: {request.packager.public.toString()}</p>
                    </div>
                ))}
            </ul>
            <RequestPackager onRequestAdd={handleRequestAdd}></RequestPackager>
        </div>
    );
}

export default MyPackagers;