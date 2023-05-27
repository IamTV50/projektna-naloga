import React, { useState, useEffect } from "react";
import {Box, Divider} from "@chakra-ui/react";
import AdminGetPackager from "./AdminGetPackager";

function AdminShowPackagers(){
	const [packagers, setPackagers] = useState({})
	const [isLoading, setIsLoading] = useState(true);
	const [packagerChanged, setPackagerChanged] = useState(false)

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const res = await fetch(`http://localhost:3001/packagers`, {
					credentials: "include"
				})
				const data = await res.json();
				setPackagers(data);
				setIsLoading(false);
			} catch (error) {
				console.log(error)
			}
		};

		fetchRequests();
	}, [packagerChanged]);

	const setPackagerToActive = (pid) => {
		fetch(`http://localhost:3001/packagers/${pid}`, {
			method: "PUT",
			credentials: "include",
			headers: { 'Content-Type': 'application/json'},
			body: JSON.stringify({
				active: true,
			})
		})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			setPackagerChanged(!packagerChanged)
		})
		.catch((err) => {
			console.log("Error during fetch", err); // Handle the network error here
		});
	};

	const setPackagerToNotActive = (pid) => {
		fetch(`http://localhost:3001/packagers/${pid}`, {
			method: "PUT",
			credentials: "include",
			headers: { 'Content-Type': 'application/json'},
			body: JSON.stringify({
				active: false
			})
		})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			setPackagerChanged(!packagerChanged)
		})
		.catch((err) => {
			console.log("Error during fetch", err); // Handle the network error here
		});
    };

	return (
		<Box flex={1} w="100%" h="100%" overflowY="auto">
			<div>
				{isLoading ? "" : packagers.map(packager => (
					<>
						<AdminGetPackager
							key={packager._id}
							packager={packager}
							setPackagerToNotActive={setPackagerToNotActive}
							setPackagerToActive={setPackagerToActive}/>
						<Divider />
					</>
				))}
			</div>
		</Box>
	 );
}
 
export default AdminShowPackagers;