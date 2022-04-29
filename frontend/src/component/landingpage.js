import React, { useEffect }  from "react";

function LandingPage(){
    return(
    <div>
        <div className="title">Application Monitor</div>
        <div className="lddiv">
         <a href="/login" className="ldbutton">Sign In</a>
         <a href="/signup" className="ldbutton">Sign Up</a>
        </div>
    </div>)
}

export default LandingPage;