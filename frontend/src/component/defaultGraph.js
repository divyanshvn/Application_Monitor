import React, { useEffect }  from "react";
import { useState } from "react";
import { Container, Form, FormGroup,Button } from "react-bootstrap";
import ErrorMessage from "./errorMessage";
import axios from 'axios';
import AuthService from "./services/auth.service";
import { useNavigate } from "react-router-dom";
import { Bar, Line } from 'react-chartjs-2';


  

  
function DefaultGraph(props){
        const user = AuthService.getCurrentUser();
        const [getgraph, setGetGraph] = useState(false);
        const [data, setData] = useState([]);
        const [label, setLabels] = useState([]);
        const show_length = 20;
        
           useEffect(() => {
         //       console.log(props.sendval.metric,props.process,props.starttime,props.endtime);
                if (user){
                setInterval(() => {
                    fetch(`http://localhost:3001/graph/${props.sendval.process}/${props.sendval.metric}/${props.sendval.starttime}/${props.sendval.endtime}`)
                      .then(res => res.json())
                      .then(data => {
                        var x = data["time"];
                        var y = data["value"];
                        var xnew ;
                        var ynew ;
                        if (x.length > show_length){
                             xnew = x.slice(x.length - show_length,x.length);
                             ynew = y.slice(y.length - show_length,y.length)
                        }
                        else{
                            xnew = x;
                            ynew = y;
                        }
                        // data.map((item, index) => {
                        //   x.push(item.time);
                        //   y.push(item.value);
                        // })
                        setData(ynew);
                        setLabels(xnew);
                        setGetGraph(true);
                      })
                  }, 3000)
                }
                  else{
                    window.location.href='/';
                   }
           }, [])
       
            const Options = {
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: props.sendval.graphtitle,
                    font: {
                        size: 16
                    },
                    color:"white",
                  },
                  legend: {
                    display: false,
                    position: "left",
                    labels: {
                        color:"white",
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: true,
                  

                }
              }
       const datas = {
        labels: label,
        color:"white",
        datasets: [
          {
            label: props.sendval.yaxis,
            data: data,
            backgroundColor: props.sendval.backgroundcolor,
            borderColor: props.sendval.backgroundcolor,
            color:"white",
            lineWidth: 2,
            borderWidth: 2 ,
          }
        ]
      }

      return(
          <div>
            {getgraph ? (<div ><Line data={datas} options={Options} /></div>) : (<div></div>)}
          </div>
      )
      
}

export default DefaultGraph;
