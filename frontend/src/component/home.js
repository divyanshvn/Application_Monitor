import React, { useEffect }  from "react";
import DefaultUI from "./defaultUI";
import AuthService from "./services/auth.service";

function Home(){
    const user = AuthService.getCurrentUser();
    console.log(user,19);
return(
    <div>
        <div>Hello {user["name"]} </div>
        <DefaultUI/>
    </div>
     );
}

export default Home;