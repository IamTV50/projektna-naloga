import React, { useContext } from "react";

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
                        fetch(`http://localhost:3001/users/addPackage`, {
                            method: "PUT",
							credentials: "include",
							headers: { 'Content-Type': 'application/json'},
							body: JSON.stringify({
								username: props.request.user.username,
								packageNumber: props.request.package.number
							})
                        }).then((res) => {
                            //window.location.href="/";
                        }).catch((err) => {
                            console.log("Error adding package to user", err);
							setError("Package doesn't exist or user already has access to this package!")
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
                        fetch(`http://localhost:3001/requests/${props.request._id}`, {
                            method: "DELETE",
                            credentials: "include",
                        }).then((res) => {
                            //window.location.href="/";
                        }).catch((err) => {
                            console.log("Error deleting request", err);
                        });

                    }
                },
                {
                    label: 'No',
                }
            ]
        });

    };

    return (
        <div>
            <p>User: {props.request.user.username}</p>
            <p>Package: {props.request.package.number}</p>
			<p>Reason: {props.request.reason}</p>
			<button onClick={acceptRequest}>Accept</button>
            <button onClick={deleteRequest}>Delete</button>
			<p>{error}</p>
        </div>
    );
}
 
export default AdminGetRequest;