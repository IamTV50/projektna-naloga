import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

function Package(props) {
	const [packagerUnlocks, setPackagerUnlocks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUnlocks = async () => {
			try {
				const res = await fetch(`http://localhost:3001/unlocks/packagerUnlocks/${props.packager._id}`, {
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

    console.log("Props:" + props)
    return (
        <div >
            <h5>Packager number: {props.packager.number}</h5>
            <p>Public: {props.packager.public.toString()}</p>
            <p>Active: {props.packager.active.toString()}</p>
			{isLoading ? "" : packagerUnlocks.length === 0 ? <p>No unlocks</p> :
			<div>
				<h6>Last opened: {new Date(packagerUnlocks[0].openedOn).toLocaleString("de-DE")}</h6>
				<p>By: {packagerUnlocks[0].user.username}</p>
				<p>Successfully: {packagerUnlocks[0].success.toString()}</p>
				<p>Reason: {packagerUnlocks[0].status}</p>
			</div>
			}
			<Link to='/my-packagers/hostory' state={ props.packager }>
				<button>Show history</button>
			</Link>
        </div>
    );
}

export default Package;