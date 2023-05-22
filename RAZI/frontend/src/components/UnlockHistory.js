import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

function AdminShowUserProfile() {
	const location = useLocation();
	const packager = location.state;
	const [packagerUnlocks, setPackagerUnlocks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUnlocks = async () => {
			try {
				const res = await fetch(`http://localhost:3001/unlocks/packagerUnlocks/${packager._id}`, {
					credentials: "include"
				})
				const data = await res.json();
				console.log(data);

				if (!data.message) {
					setPackagerUnlocks(data);
				}

				setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		};

		fetchUnlocks();
	}, []);

	return ( 
		<div>
			<h3>Packager {packager.number} history:</h3>
			{isLoading ? ""
			: packagerUnlocks.length === 0 ? <span>There is no unlock history for this packager.</span> 
			: <ul>
				{packagerUnlocks.map((unlock) => (
				<li key={unlock._id}>
					<span>packager number: {unlock.packager.number}</span>
					<span> successfully opened: {unlock.success.toString()}</span>
					<span> reason: {unlock.status}</span>
					<span> date: {new Date(unlock.openedOn).toLocaleString("de-DE")}</span>
				</li>
				))}
			</ul>
			}
		</div>
	 );
}
 
export default AdminShowUserProfile;