import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, BrowserRouter } from 'react-router-dom';
import Home from './component/home';
import Graph from './component/graph';
import SideBar from './component/sideBar';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import 'bootstrap/dist/css/bootstrap.css';
import './component/style.css';
import ShowGraph from './component/showGraph';
import ThresholdForm from './component/thresholdForm';
import SignupForm from './component/signupForm';
import LoginForm from './component/LoginForm';
import LandingPage from './component/landingpage';
import AuthService from "./component/services/auth.service";
import { useNavigate } from "react-router-dom";
import DefaultUI from './component/defaultUI';
import AlertList from './component/alertList';


function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    document.body.style.backgroundColor = "#07070e"
    const user = AuthService.getCurrentUser();
    console.log(user, 15);
    if (user) {
      console.log(50);
      setCurrentUser(user);
    }
  }, []);

  function logoutSite() {
    AuthService.logout();
    setCurrentUser(undefined);
    window.location.href = '/';
    // navigate("/home");
    //   window.location.reload();
  }

  return (
    <Router>
      <div className='App'>

        <div className="sidenavbar">

          {currentUser ? (<div>
            <div className="subtitle">Application Monitor</div>
            <a href="/home">Home</a>
            <a href="/generategraph">Generate Graph</a>
            <a href="/thresholdform">Set Threshold</a>
            <a href="/listalerts">Alerts</a>
            <button onClick={logoutSite} className='navbutton'>Logout</button>
          </div>) : (<div style={{ color: "white" }}>Application Monitor</div>)}

        </div>
        {/*<MyRoute/>*/}

        <Routes>
          <Route path="/graph" element={<Graph />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/generategraph" element={<ShowGraph />} />
          <Route path="/thresholdform" element={<ThresholdForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/listalerts" element={<AlertList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
