import axios from "axios";

const API_URL = "/auth"; // route change

const signup = (name,email,password) => {
  return axios
    .post("http://localhost:3001/user/register/", {
      name,
      email,
      password,
    })
    .then((response) => {
      return response.data;
    });
};

const login = (email, password) => {
  return axios
    .post("http://localhost:3001/user/login", {
      email,
      password,
    })
    .then((response) => {
      if(response.data.proceed == 1){
          // data ?
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
      }
      else{
         alert("login failed");
        //  return response.error;
      }

    });
};

const logout = () => {
  localStorage.removeItem("user");
  
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const authService = {
  signup,
  login,
  logout,
  getCurrentUser,
};

export default authService;