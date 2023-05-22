import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

function AdminShowUserProfile(){
	const location = useLocation();
  	const user = location.state;

	const [userUnlocks, setUserUnlocks] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const res = await fetch(`http://localhost:3001/unlocks/userUnlocks/${user._id}`, {
					credentials: "include"
				})
				const data = await res.json();
				setUserUnlocks(data);
				setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		};

		fetchRequests();
	}, []);

	return ( 
		<div>
			<div>
				<h3>User info</h3>
				<p>Username: {user.username}</p>
				<p>Email: {user.email}</p>
			</div>
			<div>
				<h3>User unlocked packagers:</h3>
				{isLoading ? ""
				: userUnlocks.message !== undefined ? <span>{userUnlocks.message}</span> 
				: <ul>
					{userUnlocks.map((unlock) => (
					<li key={unlock._id}>
						<span>packager number: {unlock.packager.number}</span>
						<span> successfully opened: {unlock.success ? "true" : "false"}</span>
						<span> reason: {unlock.status}</span>
						<span> date: {new Date(unlock.openedOn).toLocaleString("de-DE")}</span>
					</li>
					))}
				</ul>
				}
			</div>
		</div>
	 );
}
 
export default AdminShowUserProfile;