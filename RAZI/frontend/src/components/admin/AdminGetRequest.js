import React, { useState } from "react";
import { confirmAlert } from 'react-confirm-alert';

function AdminGetRequest(props) {
    const [error, setError] = useState("");

	const acceptRequest = () => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure you want to accept this request?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        fetch(`http://localhost:3001/users/addPackager`, {
                            method: "PUT",
							credentials: "include",
							headers: { 'Content-Type': 'application/json'},
							body: JSON.stringify({
								username: props.request.user.username,
								packagerNumber: props.request.packager.number
							})
                        }).then((res) => res.json())
						.then((data) => {
							if (data.message) {
								setError(data.message);
							}

							if (!data.error) {
								Delete();
							}
						})
						.catch((err) => {
							console.log("Error adding packager to user", err);
							setError("Error occurred while accepting the request!");
						});
                    }
                },
                {
                    label: 'No',
                }
            ]
        });
    };

	const deleteRequest = () => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure you want to delete this request?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        Delete();
                    }
                },
                {
                    label: 'No',
                }
            ]
        });
    };

	const Delete = async () => {
		try {
			const response = await fetch(`http://localhost:3001/requests/${props.request._id}`, {
				method: "DELETE",
				credentials: "include",
			});
		
			if (response.status === 204) {
				props.onRequestDeleted(props.request._id);
			} else {
				setError("Error occurred while deleting the request!");
			}
		} catch (err) {
			console.log("Error deleting request", err);
			setError("Error occurred while deleting the request!");
		}
	};

	console.log(props);

    return (
        <div>
            <p>User: {props.request.user ? props.request.user.username : "[deleted]"}</p>
            <p>Packager: {props.request.packager ? props.request.packager.number : "[deleted]"}</p>
			<p>Reason: {props.request.reason}</p>
			<p>Date: {new Date(props.request.created).toLocaleString("de-DE")}</p>
			<button onClick={acceptRequest}>Accept</button>
            <button onClick={deleteRequest}>Delete</button>
			<p>{error}</p>
        </div>
    );
}
 
export default AdminGetRequest;