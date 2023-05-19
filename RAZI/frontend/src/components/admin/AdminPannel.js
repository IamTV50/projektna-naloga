import React, { useState, useEffect } from "react";
import AdminGetRequest from "./AdminGetRequest";
import AdminAddPackage from "./AdminAddPackage";
import AdminShowUsers from "./AdminShowUsers";

function AdminPannel() {
	const [requests, setRequests] = useState([]);
	const [deletedRequest, setDeletedRequest] = useState(null);
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
	}, [deletedRequest]);

	const handleRequestDelete = (requestId) => {
		setDeletedRequest(requestId);
	};

	return ( 
		<div>
			<h3>TODO</h3>
			<div>
				<AdminAddPackage></AdminAddPackage>
			</div>
			<div>
				<h3>Requests:</h3>
				<div>
					<ul>
						{isLoading ? "" : requests.map(request => (<AdminGetRequest request={request} key={request._id} onRequestDeleted={handleRequestDelete}></AdminGetRequest>))}
					</ul>
				</div>
			</div>
			<div>
				<h3>Users list:</h3>
				<AdminShowUsers onRequestDeleted={handleRequestDelete}></AdminShowUsers>
			</div>
		</div>
	);
}
 
export default AdminPannel;