import React, { useState } from "react";

function AdminAddPackage() {
	const [number, setNumber] = useState(0);
	const [publicPackage, setPublicPackage] = useState(true);
    const [error, setError] = useState("");

    async function AddPackage(e){
        e.preventDefault();
        const res = await fetch("http://localhost:3001/packages", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                number: number,
                public: publicPackage
            })
        });
        const data = await res.json();
        console.log(data);

		setNumber(0);
		setPublicPackage(true);

        if (data._id == undefined) {
            setError(data.message);
        }
    }

	return ( 
		<form onSubmit={AddPackage}>
            <input type="number" name="number" placeholder="Number"
                   value={number} onChange={(e)=>(setNumber(e.target.value))}/>
			<label> Public: 
				<input type="checkbox" name="publicPackage"
						checked={publicPackage} onChange={(e) => setPublicPackage(e.target.checked)}/>
			</label>
            <input type="submit" name="submit" value="Add"/>
            <label>{error}</label>
        </form>
	);
}
 
export default AdminAddPackage;