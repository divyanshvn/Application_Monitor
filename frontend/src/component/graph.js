import React, { useEffect }  from "react";
import { useState } from "react";
import { Chart,Bar,Line} from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import {BrowserRouter as Router,
  Link,
  Route,
  Routes,
  useParams
} from "react-router-dom";

const Options = {
  plugins: {
    title: {
      display: true,
      text: "MATCH V/S RUN SCORED"
    },
    legend: {
      display: false,
      position: "left"
   },
   responsive: true,
   maintainAspectRatio: true,
     
  }
}


function Graph(props){

    const [data, setData] = useState([]);
    const [X, setX] = useState([]);
    const [Y, setY] = useState([]);
    const [Z, setZ] = useState([]);
    const WAIT_TIME = 5000;

    useEffect(() => {
      /*setInterval(() => {*/
        fetch('http://localhost:3001/')
        .then(res => res.json())
        .then(data => {
          var a = [];
          var b = [];
          var color = [];
          console.log(data);
         data.map((item, index) => {
          a.push(item.match);
          if(item.runs <30){
             color.push("#ffbb11");
          }
          else if(item.runs >=30 && item.runs <= 50){
             color.push( "#2a71d0");
          }
          else{
             color.push("#50AF95")
          }
          b.push(item.runs);
         });
         setX(a);
         setY(b);
         setZ(color);
         setData(data);

        })
    /*  },5000);*/
    }, []);


    const datas = {
      labels: X,
      datasets: [
        {
          label: "Run Scored",
          data: Y,
          backgroundColor: Z,
          maxBarThickness: 60
        }
      ]
    }

    return (
        <div className="match">
               <Bar data={datas} 
        options={Options}/>
        </div>
    )
}
export default Graph; 


