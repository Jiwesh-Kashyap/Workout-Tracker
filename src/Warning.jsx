import React, { useState } from "react";

function Warning(){

    return(
        <div className="delete-warning">
            <div>
                <p>This will delete this record!</p>
                <button id="delete-button">Delete</button>
                <button id="cancel-button">Cancel</button>
            </div>
        </div>
    )
}

export default Warning;