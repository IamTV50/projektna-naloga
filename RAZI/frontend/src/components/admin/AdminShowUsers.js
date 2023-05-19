import React, { useContext, useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { UserContext } from '../../userContext';

function AdminShowUsers(){
	const userContext = useContext(UserContext);
	const [users, setUsers] = useState({})
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const res = await fetch(`http://localhost:3001/users`, {
					credentials: "include"
				})
				const data = await res.json();
				setUsers(data);
				setIsLoading(false);
			} catch (error) {
				console.log(error)
			}
		};

		fetchRequests();
	}, [])

	const deleteUser = (e) => {
        confirmAlert({
            title: 'Confirm user deletion',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        fetch(`http://localhost:3001/users/${e.target.value}`, {
                            method: "DELETE",
                            credentials: "include",
                        }).then((res) => {
                            userContext.setUserContext(null);
                            //window.location.href="/";
                        }).catch((err) => {
                            console.log("Error deleting user", err);
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
			<ul>
				{isLoading ? "" : users.map(user => (
					<li key={user._id}>
						<span>{user.username} </span>  
						<span> {user.email}</span>
						<button onClick={deleteUser} value={user._id}>delete user</button>
					</li>	
				))}
			</ul>
		</div>
	 );
}
 
export default AdminShowUsers;