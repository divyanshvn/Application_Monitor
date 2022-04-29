import React, { useEffect,useState }  from "react";
import { Form, Button, Container, Alert } from 'react-bootstrap';
import {processlist,cpulist,disklist,diskIolist,internetlist,dockerlist,postgreslist,systemList,wirelessList} from './constant';
import AuthService from "./services/auth.service";

function ThresholdForm(){

const [processname, setprocessname] = useState('');
    const [metricname, setMetricName] = useState('');
    const [threshold, setThreshold] = useState('');
    const user = AuthService.getCurrentUser()["id"];
    const processChangeHandler = (event) => {
        setprocessname(event.target.value);
    }

    const metricChangeHandler = (event) => {
        setMetricName(event.target.value);
    }

    const thresholdChangeHandler = (event) => {
        setThreshold(event.target.value);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const check = Number(threshold);
        if (Number.isInteger(check)){
            fetch('http://localhost:3001/add_check/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({processname,metricname,threshold,user}),
            })
            .catch(error => {
              console.error("There was an Error",error);
            });
        }
        else{
            alert("whattttt!");
        }
    }
return(
      
        <Container>
        <div className="graphformdiv">
        <Form onSubmit={handleSubmit} className="graphform">
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
                    console.log(processname)
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
        <Form.Group  controlId="form.timeend">
              <Form.Label>Threshold</Form.Label>
              <Form.Control type="int" placeholder="Set Threshold" required onChange={thresholdChangeHandler}/>
          </Form.Group>
          <Button type='submit' className="graphbutton">Set Threshold</Button>
        </Form>
        </div>
      </Container>
    
      );
}

export default ThresholdForm;