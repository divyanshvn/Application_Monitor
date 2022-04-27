import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route,Routes, Link, BrowserRouter} from 'react-router-dom';
import Home from './component/home';
import Graph from './component/graph';
import SideBar from './component/sideBar';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import 'bootstrap/dist/css/bootstrap.css';
import MyRoute from './component/MyRoute';
import './component/style.css';
import ShowGraph from './component/showGraph';
import ThresholdForm from './component/thresholdForm';

function App() {
  return (
    <Router>   
      <div className='App'>

      <MyRoute/> 
      {/*<MyRoute/>*/}
      
        <Routes>
          <Route path="/graph" element={<Graph/>} />
          <Route path="/" element={<Home/>} />
          <Route path="/generategraph" element={<ShowGraph/>}/>
          <Route path="/thresholdform" element={<ThresholdForm/>}/>
      </Routes>
      </div>
    </Router>
  );
}

export default App;
