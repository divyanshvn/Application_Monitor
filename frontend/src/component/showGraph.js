import React, { useEffect, useState } from "react";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { processlist, cpulist, disklist, diskIolist, internetlist, dockerlist, postgreslist, systemList, wirelessList } from './constant';
import { Bar, Line } from 'react-chartjs-2';
import AuthService from "./services/auth.service";

const Options = {
  plugins: {
    title: {
      display: true,
      text: "mAtch vs something"
    },
    legend: {
      display: false,
      position: "left"
    },
    responsive: true,
    maintainAspectRatio: true,
  }
}




function ShowGraph() {
  const [processname, setprocessname] = useState('');
  const [metricname, setMetricName] = useState('');
  const [starttime, setStartTime] = useState('');
  const [endtime, setEndTime] = useState('');
  const [data, setData] = useState([]);
  const [label, setLabels] = useState([]);
  const [getgraph, setGetGraph] = useState(false);

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

  async function fetchData() {
    const user = AuthService.getCurrentUser();
    if (user){
    setInterval(() => {
      fetch(`http://localhost:3001/graph/${processname}/${metricname}/${starttime}/${endtime}`)
        .then(res => res.json())
        .then(data => {
          var x = data["time"];
          var y = data["vals"];
          console.log(data);
          // data.map((item, index) => {
          //   x.push(item.time);
          //   y.push(item.value);
          // })
          setData(y);
          setLabels(x);
          setGetGraph(true);
          console.log(data);
        })
    }, 10000)
   }
   else{
    window.location.href='/';
   }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const HandleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  }
  //const submitHandler = (event) => {  // add submit here
  // event.preventDefault();
  //   alert("thankyou");
  // }
  const datas = {
    labels: label,
    datasets: [
      {
        label: "Metric Value",
        data: data
      }
    ]
  }


  return (

    <Container>
      <Form onSubmit={HandleSubmit} style={{ width: "30rem" }}>
        <Form.Label>Process</Form.Label>
        <Form.Select aria-label="Default select example" onChange={processChangeHandler}>
          <option>Open this to select Process</option>
          {processlist.map(item => {
            return (<option value={item.value}>{item.text}</option>);
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
                      <option value={item.value}>{item.text}</option>);
                  })
                )
              } else if (processname === 'disk') {
                return (
                  disklist.map(item => {
                    return (
                      <option value={item.value}>{item.text}</option>);
                  })
                )
              } else if (processname === 'diskio') {
                return (
                  diskIolist.map(item => {
                    return (
                      <option value={item.value}>{item.text}</option>);
                  })
                )
              }
              else if (processname === 'docker') {
                return (
                  dockerlist.map(item => {
                    return (
                      <option value={item.value}>{item.text}</option>);
                  })
                )
              } else if (processname === 'internetspeed') {
                return (
                  internetlist.map(item => {
                    return (
                      <option value={item.value}>{item.text}</option>);
                  })
                )
              } else if (processname === 'postgres') {
                return (
                  postgreslist.map(item => {
                    return (
                      <option value={item.value}>{item.text}</option>);
                  })
                )
              } else if (processname === 'system') {
                return (
                  systemList.map(item => {
                    return (
                      <option value={item.value}>{item.text}</option>);
                  })
                )
              } else if (processname === 'wireless') {
                return (
                  wirelessList.map(item => {
                    return (
                      <option value={item.value}>{item.text}</option>);
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
        <Button type='submit'>Get Graph</Button>
      </Form>
      {getgraph ? (<div><Line data={datas} options={Options} /></div>) : (<div></div>)}
    </Container>

  );
}

export default ShowGraph;