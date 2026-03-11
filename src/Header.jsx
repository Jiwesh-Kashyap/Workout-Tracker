import React from "react";

function Header({dayName}){
    const name = dayName.toUpperCase();
    return(<div id="heading">
        <h2>{name} PLAN</h2>
    </div>);
}

export default Header;