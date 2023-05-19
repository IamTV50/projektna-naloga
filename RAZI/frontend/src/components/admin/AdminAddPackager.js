import React, { useState } from "react";

function AdminAddPackager() {
	const [number, setNumber] = useState(0);
	const [publicPackager, setPublicPackager] = useState(true);
    const [error, setError] = useState("");

    async function AddPackager(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:3001/packagers", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                number: number,
                public: publicPackager
            })
        });
        const data = await res.json();
        console.log(data);

		setNumber(0);
		setPublicPackager(true);

        if (data._id === undefined) {
            setError(data.message);
        }
    }

	return ( 
		<form onSubmit={AddPackager}>
            <input type="number" name="number" placeholder="Number"
                   value={number} onChange={(e)=>(setNumber(e.target.value))}/>
			<label> Public: 
				<input type="checkbox" name="publicPackager"
						checked={publicPackager} onChange={(e) => setPublicPackager(e.target.checked)}/>
			</label>
            <input type="submit" name="submit" value="Add"/>
            <label>{error}</label>
        </form>
	);
}
 
export default AdminAddPackager;