import React, { useState, useEffect } from "react";
import AdminGetRequest from "./AdminGetRequest";
import AdminAddPackager from "./AdminAddPackager";
import AdminShowUsers from "./AdminShowUsers";
import AdminShowPackagers from "./AdminShowPackagers";

function AdminPannel() {
	const [requests, setRequests] = useState([]);
	const [deletedId, setDeletedId] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const res = await fetch(`http://localhost:3001/requests`, {
					credentials: "include"
				})
				const data = await res.json();
				setRequests(data);
				setIsLoading(false);
			} catch (error) {
				console.log(error)
			}
		};

		fetchRequests();
	}, [ deletedId ]);

	const handleIdDelete = (deletedId) => {
		setDeletedId(deletedId);
	};

	return ( 
		<div>
			<h3>TODO</h3>
			<div>
				<AdminAddPackager></AdminAddPackager>
			</div>
			<div>
				<h3>Requests:</h3>
				<div>
					<ul>
						{isLoading ? "" : requests.map(request => (<AdminGetRequest request={request} key={request._id} onRequestDeleted={handleIdDelete}></AdminGetRequest>))}
					</ul>
				</div>
			</div>
			<div>
				<h3>Users list:</h3>
				<AdminShowUsers onRequestDeleted={handleIdDelete}></AdminShowUsers>
			</div>
			<div>
				<h3>Packagers list:</h3>
				<AdminShowPackagers></AdminShowPackagers>
			</div>
		</div>
	);
}
 
export default AdminPannel;