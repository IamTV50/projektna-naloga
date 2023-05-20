import React, {useContext, useState} from 'react'
import { useCollapse } from 'react-collapsed'
import {UserContext} from "../userContext";

function RequestPackager({ onRequestAdd }) {
    const userContext = useContext(UserContext);
    const [isExpanded, setExpanded] = useState(false)
    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })
    const [reasonText, setReasonText] = useState('');
    const [packagerNumber, setPackagerNumber] = useState('');
    const [error, setError] = useState("");

    const handleReasonChange = (e) => {
        setReasonText(e.target.value);
    };

    const handlePackagerNumberChange = (e) => {
        setPackagerNumber(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        submitRequest(reasonText, packagerNumber);
        setReasonText('');
        setPackagerNumber('')
    };

    const submitRequest = ( reasonText, packagerNumber ) => {
        console.log("submitRequest")
        console.log(reasonText, packagerNumber);
        fetch(`http://localhost:3001/requests/userRequestPackage`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: reasonText, packagerNumber: packagerNumber }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status != 201) {
                    throw new Error(data.message);
                }
                onRequestAdd(data);
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    return (
        <div>
            <button
                {...getToggleProps({
                    onClick: () => setExpanded((prevExpanded) => !prevExpanded),
                })}
            >
                {isExpanded ? 'Pridobi paketnik' : 'Pridobi paketnik'}
            </button>
            <section {...getCollapseProps()}>
                <form onSubmit={handleSubmit}>
                    <p>Razlog:
                        <textarea value={reasonText} onChange={handleReasonChange} name="reason" />
                    </p>
                    <p>Številka paketnika:
                        <input value={packagerNumber} onChange={handlePackagerNumberChange} type="number" name="packagerNumber" />
                    </p>
                    <input type="submit"    name="submit" value="Submit"/>
                    <label>{error}</label>
                </form>

            </section>
        </div>
    )
}

export default RequestPackager;