import React, { useEffect,useState }  from "react";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import {processlist,cpulist,disklist,diskIolist,internetlist,dockerlist,postgreslist,systemList,wirelessList} from './constant';

function ShowGraph(){
    const [processname, setprocessname] = useState('');
    const [metricname, setMetricName] = useState('');
    const [starttime, setStartTime] = useState('');
    const [endtime,setEndTime] = useState('');
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
    
    const handleSubmit = (event) => {
        event.preventDefault();
        if (starttime > endtime && starttime < 0 && endtime <= 0 ){
            fetch('http://localhost:3001/venues/add', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({processname,metricname,starttime,endtime}),
            })
            .catch(error => {
              console.error("There was an Error",error);
            });
        }
        else {
            alert("NO NO NO");
        }
    }
    //const submitHandler = (event) => {  // add submit here
       // event.preventDefault();
     //   alert("thankyou");
   // }


    return(
      
        <Container>
        <Form onSubmit={handleSubmit}>
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
                    
                    if(processname ==='cpu') {
                         return(
                            cpulist.map(item => {
                                return(
                                <option value={item.value}>{item.text}</option>);
                            })
                         )
                        } else if (processname ==='disk') {
                            return (
                              disklist.map(item => {
                                   return(
                                    <option value={item.value}>{item.text}</option>); 
                              })
                            )
                        } else if (processname ==='diskio') {
                            return (
                              diskIolist.map(item => {
                                   return(
                                    <option value={item.value}>{item.text}</option>); 
                              })
                            )
                        }
                        else if (processname ==='docker') {
                            return (
                              dockerlist.map(item => {
                                   return(
                                    <option value={item.value}>{item.text}</option>); 
                              })
                            )
                        }else if (processname ==='internetspeed') {
                            return (
                              internetlist.map(item => {
                                   return(
                                    <option value={item.value}>{item.text}</option>); 
                              })
                            )
                        }else if (processname ==='postgres') {
                            return (
                              postgreslist.map(item => {
                                   return(
                                    <option value={item.value}>{item.text}</option>); 
                              })
                            )
                        }else if (processname ==='system') {
                            return (
                              systemList.map(item => {
                                   return(
                                    <option value={item.value}>{item.text}</option>); 
                              })
                            )
                        }else if (processname ==='wireless') {
                            return (
                              wirelessList.map(item => {
                                   return(
                                    <option value={item.value}>{item.text}</option>); 
                              })
                            )
                        }
                        else {
                            return ( <option>Open this to select Process</option>)
                        }

                })()  
            } 

        </Form.Select>
          <Form.Group  controlId="form.timestart">
              <Form.Label>TimeStamp Start</Form.Label>
              <Form.Control type="int" placeholder="Enter Start time" required onChange={startChangeHandler} />
          </Form.Group>
          <Form.Group  controlId="form.timeend">
              <Form.Label>TimeStamp End</Form.Label>
              <Form.Control type="int" placeholder="Enter End Time" required onChange={endChangeHandler}/>
          </Form.Group>
          <Button type='submit'>Get Graph</Button>
        </Form>
      </Container>
  
      );
}

export default ShowGraph;