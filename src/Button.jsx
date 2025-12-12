import React from "react";
import PropTypes from "prop-types";

function Button({name, ...rest}){
    return(
        <button className="input-button" {...rest}>{name}</button>
    );
}
Button.propTypes = {
    name: PropTypes.string.isRequired
}
export default Button