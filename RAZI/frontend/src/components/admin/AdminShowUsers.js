import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';

function AdminShowUsers({ onRequestDeleted }){
	const [users, setUsers] = useState({})
	const [isLoading, setIsLoading] = useState(true);
	const [deletedUser, setDeletedUser] = useState(null);
	const [searchName, setSearchName] = useState("");
	const [searchEmail, setSearchEmail] = useState("");
	const [searchedUsers, setSearchedUsers] = useState([]);

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
	}, [ deletedUser ])

	const deleteUser = (uid) => {
        confirmAlert({
            title: 'Confirm user deletion',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        fetch(`http://localhost:3001/users/${uid}`, {
                            method: "DELETE",
                            credentials: "include",
                        }).then((res) => {
                            setDeletedUser(uid)
							onRequestDeleted(uid)
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

	const searchUsers = () => {
		if(searchName === "" && searchEmail === ""){
			alert("both inputs should not be empty!!");
			return
		}

		let tmpSearchedUsers = []
		users.map(user => {
			if(user.username === searchName || user.email === searchEmail){
				tmpSearchedUsers.push(user)
			}
		})

		if(tmpSearchedUsers.length == 0){
			alert("0 users have that name or email");
			return
		}
		else{
			setSearchedUsers(tmpSearchedUsers)
		}
	};

	const handleResetSearch = () => {
		setSearchName("");
		setSearchEmail("");
		setSearchedUsers([]);
		document.getElementById('userNameSearch_input').value = ""
		document.getElementById('userEmailSearch_input').value = ""
	}

	const handleNameInputChange = (e) => { setSearchName(e.target.value); }
	const handleEmailInputChange = (e) => { setSearchEmail(e.target.value); }

	return ( 
		<div>
			<input type='text' id='userNameSearch_input' placeholder='search by name' onChange={handleNameInputChange}/> <br/>
			<input type='text' id='userEmailSearch_input' placeholder='search by email' onChange={handleEmailInputChange}/> <br/>
			<button onClick={() => searchUsers()}>search</button> 
			{ searchedUsers.length > 0 ? <button onClick={() => handleResetSearch()}>reset</button> : "" }
			<br/>
			<ul>
				{isLoading
					? ""
					: searchedUsers.length > 0
					? searchedUsers.map((user) => (
						<li key={user._id}>
						<span>{user.username} </span>
						<span> {user.email}</span>
						<button onClick={() => deleteUser(user._id)}>delete user</button>
						</li>
					))
					: users.map((user) => (
						<li key={user._id}>
						<span>{user.username} </span>
						<span> {user.email}</span>
						<button onClick={() => deleteUser(user._id)}>delete user</button>
						</li>
					))}
			</ul>
		</div>
	 );
}
 
export default AdminShowUsers;