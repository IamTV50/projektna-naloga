import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';

function AdminShowUserProfile() {
	const location = useLocation();
  	const [user, setUser] = useState(location.state);
	const [userUnlocks, setUserUnlocks] = useState([]);
	const [updatedPackager, setUpdatedPackager] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [packagerNumber, setPackagerNumber] = useState(0)
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch(`http://localhost:3001/users/${user._id}`, {
					credentials: "include"
				})
				const data = await res.json();
				setUser(data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchUser();
	}, [updatedPackager]);

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

	async function AddPackagerToUser(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:3001/users/addPackager", {
            method: "PUT",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
				username: user.username,
				packagerNumber: packagerNumber
			})
        });
        const data = await res.json();
        console.log(data);

        if (data._id === undefined) {
            setError(data.message);
        } else {
			setUpdatedPackager(packagerNumber)
		}

		setPackagerNumber(0);
    }

	const deletePackager = (pnum) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure you want to remove this packager from user?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        fetch(`http://localhost:3001/users/removePackager`, {
                            method: "PUT",
							credentials: "include",
							headers: { 'Content-Type': 'application/json'},
							body: JSON.stringify({
								username: user.username,
								packagerNumber: pnum
							})
                        }).then((res) => res.json())
						.then((data) => {
							if (!data.error) {
								setUpdatedPackager(pnum)
							}
						})
						.catch((err) => {
							console.log("Error removing packager to user", err);
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
			<div>
				<h3>User info</h3>
				<p>Username: {user.username}</p>
				<p>Email: {user.email}</p>
			</div>
			<div>
			<h3>User Packagers:</h3>
				{user.packagers.length > 0 ? 
				<ul>
					{user.packagers.map((packager) => (
					<li key={packager._id}>
						<span>packager number: {packager.number}</span>
						<button onClick={() => deletePackager(packager.number)}>delete</button>
					</li>
					))}
				</ul> :
					<span>No packagers found for the user.</span>
				}
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
			<div>
				<form onSubmit={AddPackagerToUser}>
					<input type="number" name="number" placeholder="Number"
						value={packagerNumber} onChange={(e)=>(setPackagerNumber(e.target.value), setError(""))}/>
					<input type="submit" name="submit" value="Add"/>
					<label>{error}</label>
				</form>
			</div>
		</div>
	 );
}
 
export default AdminShowUserProfile;