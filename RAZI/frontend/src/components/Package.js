import React from "react";

function Package(props) {
    console.log("Props:" + props)
    return (
        <div >
            <h5>Packager number: {props.packager.number}</h5>
            <p>Public: {props.packager.public.toString()}</p>
            <p>Active: {props.packager.active.toString()}</p>
        </div>
    );
}

export default Package;