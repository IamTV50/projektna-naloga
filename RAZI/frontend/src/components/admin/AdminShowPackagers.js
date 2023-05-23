import React, { useState, useEffect } from "react";

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
			setPackagerChanged(packagerChanged ? false : true)
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
			setPackagerChanged(packagerChanged ? false : true)
		})
		.catch((err) => {
			console.log("Error during fetch", err); // Handle the network error here
		});
    };

	return ( 
		<div>
			{isLoading ? "" : packagers.map(packager => (
				<li key={packager._id}>
					<span>package number: {packager.number} </span>
					<span>visibility: {packager.public ? "public" : "private"} </span>
					<span>active: {packager.active ? "yes" : "no"} </span>
					{packager.active ? 
						<button onClick={() => setPackagerToNotActive(packager._id)}>deactivate</button>
						: <button onClick={() => setPackagerToActive(packager._id)}>activate</button>
					}
				</li>
			))}
		</div>
	 );
}
 
export default AdminShowPackagers;