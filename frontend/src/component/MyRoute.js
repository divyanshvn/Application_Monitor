import React, { useEffect, useState }  from "react";
import AuthService from "./services/auth.service";
import { useNavigate } from "react-router-dom";

function MyRoute(props){
    const [show,setshow] = useState(undefined);
    const navigate = useNavigate();
    useEffect(() => {
      setshow(props);
        console.log(show,17);
    }, []);
    
      function logoutSite() {
          setshow(undefined);
          AuthService.logout();
          navigate("/home");
          window.location.reload();

      }
    
    

    return(
        <div className="sidenavbar">
            <div>Application Monitor</div>
            {show ? (<div>
            <a href="/home">Home</a>
            <a href="/generategraph">Generate Graph</a>
            <a href="/thresholdform">Set Threshold</a>
            <button>Logout</button>
            </div>):(<div></div>)}
            
        </div>
    )
}

export default MyRoute;