import React from "react";

function Footer(){
    return(
        <div className="footer">
        <div className="footer-child">
            <div className="greet">THANK YOU FOR USING :)</div>
            <div className="handles">
                <a target="_blank" href="https://github.com/Jiwesh-Kashyap" className="git">Git</a>
                <a target="_blank" href="https://www.linkedin.com/in/jiwesh-kashyap-1364b8375/" className="linked-in">LinkedIn</a>
                <a target="_blank" href="https://discordapp.com/users/1360538351773683782" className="discord">Discord</a>
            </div>
        </div>
        <div className="made-by">
                <u id='pre-name'>MADE BY</u><pre id='name'>JIWESH</pre>
        </div>
        </div>
    );
}
export default Footer;