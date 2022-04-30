import React, { useEffect, useState } from "react";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { processlist, cpulist, disklist, diskIolist, internetlist, dockerlist, postgreslist, systemList, wirelessList,nodelist,processeslist,swaplist ,memorylist,networklist } from './constant';
import { Bar, Line } from 'react-chartjs-2';
import AuthService from "./services/auth.service";


var myTimer;
function ShowGraph() {
  const [processname, setprocessname] = useState('');
  const [metricname, setMetricName] = useState('');
  const [starttime, setStartTime] = useState('');
  const [endtime, setEndTime] = useState('');
  const [nodes,setNode] = useState('');
  const [data, setData] = useState([]);
  const [label, setLabels] = useState([]);
  const [getgraph, setGetGraph] = useState(false);
  const [sendrequest,setRequest] = useState(false);
  var setsnode = {"Bucket_0": "Local", "Bucket_1":"System 1","Bucket_2":"System 2"};
  const processChangeHandler = (event) => {
    setprocessname(event.target.value);
  }

  const metricChangeHandler = (event) => {
    setMetricName(event.target.value);
  }

  const startChangeHandler = (event) => {
    setStartTime(event.target.value);
  }

  const endChangeHandler = (event) => {
    setEndTime(event.target.value);
  }

  const nodeChangeHandler = (event) => {
    setNode(event.target.value);
  }

  async function fetchData() {
    const user = AuthService.getCurrentUser();
    const show_length = 50;
    
    if (user){
      if(sendrequest){
      console.log("My Timer", myTimer);
      clearInterval(myTimer);
      myTimer = setInterval(() => {
      fetch(`http://localhost:3001/graph/${nodes}/${processname}/${metricname}/${starttime}/${endtime}`)
        .then(res => res.json())
        .then(data => {
          var x = data["time"];
          var y = data["value"];

          var xnew ;
          var ynew;
          if (x.length > show_length){
            xnew = x.slice(0, show_length);
            ynew = y.slice(0, show_length);
          }
          else{
            xnew = x;
            ynew = y;
          }
          setData(ynew);
          setLabels(xnew);
          setGetGraph(true);
          // console.log(data);
        })
    }, 3000)
  }
   }
   else{
    window.location.href='/';
   }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const HandleSubmit = (event) => {
    setRequest(true);
    event.preventDefault();
    fetchData();
  }

  const Options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `${metricname} V/s Time (${setsnode[nodes]})`,
        font: {
          size: 16,
        },
        color: "white",
      },
      legend: {
        display: false,
        position: "left",
        labels: {
          color: "white",
        },
      },
      responsive: true,
      maintainAspectRatio: true,
    },
  };

const datas = {
labels: label,
color:"white",
datasets: [
{
data: data,
backgroundColor: "pink",
borderColor: "pink",
color:"white",
lineWidth: 2,
borderWidth: 2 ,
}
]
}

  return (

    <Container>
      <div className="graphformdiv">
      <Form onSubmit={HandleSubmit} className="graphform" >
      <Form.Label>System</Form.Label>
        <Form.Select aria-label="Default select example" onChange={nodeChangeHandler}>
          <option>Open this to select System</option>
          {nodelist.map(item => {
            return (<option value={item.value} key={item.value}>{item.text}</option>);
          })}
        </Form.Select>
        <Form.Label>Process</Form.Label>
        <Form.Select aria-label="Default select example" onChange={processChangeHandler}>
          <option>Open this to select Process</option>
          {processlist.map(item => {
            return (<option value={item.value} key={item.value}>{item.text}</option>);
          })}
        </Form.Select>
        <Form.Label>Metric</Form.Label>
        <Form.Select aria-label="Default select example" onChange={metricChangeHandler}>
          {
            (() => {
              <option>Open this to select Process</option>

              if (processname === 'cpu') {
                return (
                  cpulist.map(item => {
                    return (
                      <option value={item.value} key={item.value}>{item.text}</option>);
                  })
                )
              } else if (processname === 'disk') {
                return (
                  disklist.map(item => {
                    return (
                      <option value={item.value} key={item.value}>{item.text}</option>);
                  })
                )
              } else if (processname === 'diskio') {
                return (
                  diskIolist.map(item => {
                    return (
                      <option value={item.value} key={item.value}>{item.text}</option>);
                  })
                )
              }
              else if (processname === 'docker') {
                return (
                  dockerlist.map(item => {
                    return (
                      <option value={item.value} key={item.value}>{item.text}</option>);
                  })
                )
              } else if (processname === 'internet_speed') {
                return (
                  internetlist.map(item => {
                    return (
                      <option value={item.value} key={item.value}>{item.text}</option>);
                  })
                )
              } else if (processname === 'postgres') {
                return (
                  postgreslist.map(item => {
                    return (
                      <option value={item.value} key={item.value}>{item.text}</option>);
                  })
                )
              } else if (processname === 'system') {
                return (
                  systemList.map(item => {
                    return (
                      <option value={item.value} key={item.value}>{item.text}</option>);
                  })
                )
              } else if (processname === 'wireless') {
                return (
                  wirelessList.map(item => {
                    return (
                      <option value={item.value} key={item.value}>{item.text}</option>);
                  })
                )
              }
              else if (processname === 'mem') {
                return (
                  memorylist.map(item => {
                    return (
                      <option value={item.value} key={item.value}>{item.text}</option>);
                  })
                )
              }
              else if (processname === 'net') {
                return (
                  networklist.map(item => {
                    return (
                      <option value={item.value} key={item.value}>{item.text}</option>);
                  })
                )
              }
              else if (processname === 'processes') {
                return (
                  processeslist.map(item => {
                    return (
                      <option value={item.value} key={item.value}>{item.text}</option>);
                  })
                )
              }
              else if (processname === 'swap') {
                return (
                  swaplist.map(item => {
                    return (
                      <option value={item.value} key={item.value}>{item.text}</option>);
                  })
                )
              }
              else {
                return (<option>Open this to select Process</option>)
              }

            })()
          }

        </Form.Select>
        <Form.Group controlId="form.timestart">
          <Form.Label>TimeStamp Start</Form.Label>
          <Form.Control type="int" placeholder="Enter Start time" required onChange={startChangeHandler} />
        </Form.Group>
        <Form.Group controlId="form.timeend">
          <Form.Label>TimeStamp End</Form.Label>
          <Form.Control type="int" placeholder="Enter End Time" required onChange={endChangeHandler} />
        </Form.Group>
        <Button type='submit' className="graphbutton">Get Graph</Button>
      </Form>
      </div>
      {getgraph ? (<div className="generatedgraph"><Line data={datas} options={Options} /></div>) : (<div></div>)}
    </Container>

  );
}

export default ShowGraph;