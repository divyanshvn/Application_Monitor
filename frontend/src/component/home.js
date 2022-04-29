import React, { useEffect }  from "react";
import DefaultUI from "./defaultUI";
import AuthService from "./services/auth.service";

function Home(){
    const user = AuthService.getCurrentUser();
return(
    <div>
        <div>Hello {user.id} </div>
        <DefaultUI/>
    </div>
     );
}

export default Home;