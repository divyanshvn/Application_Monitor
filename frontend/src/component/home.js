import React, { useEffect }  from "react";
import SignupForm from "./signupForm";

function Home(){
return(
    <div>
        <div>This is Home</div>
        <a href="/login">Sign In</a>
        <a href="/signup">Sign Up</a>
    </div>
     );
}

export default Home;