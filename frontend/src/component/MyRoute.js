import React, { useEffect }  from "react";

function MyRoute(){
    return(
        <div className="sidenavbar">
            <a href="">About</a>
            <a href="/generategraph">Generate Graph</a>
            <a href="/thresholdform">Set Threshold</a>
            <a href="">Contact</a>
        </div>
    )
}

export default MyRoute;