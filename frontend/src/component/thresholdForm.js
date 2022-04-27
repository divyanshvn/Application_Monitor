import React, { useEffect,useState }  from "react";
import { Form, Button, Container, Alert } from 'react-bootstrap';


function ThresholdForm(){
  const processlist = [{value:'cpu',text:'CPU'},{value:'disk',text:'Disk'},{value:'diskio',text:'DiskIo'},{value:'docker',text:'Docker'},
    {value:'internetspeed',text:'Internet Speed'},{value:'postgres',text:'PostgresSql'},{value:'system',text:'System'}
   ,{value:'wireless',text:'Wireless'}];
   const cpulist = [{value:'',text:'Choose metric'},{value:'sys_num',text:'system number'},{value:'cpu_id',text:'Cpu id'},{value:'time_user',text:'time user'},{value:'time_system',text:'time system'},
{value:'time_idle',text:'time_idle'},{value:'time_active',text:'time_active'},{value:'time_iowait',text:'time_iowait'},{value:'time_softirq',text:'time_softirq'},
{value:'usage_user',text:'usage_user'},{value:'usage_system',text:'usage_system'},{value:'usage_idle',text:'usage_idle'},{value:'usage_active',text:'usage_active'},
{value:'usage_iowait',text:'usage_iowait'}];

const disklist = [{value:'',text:'Choose metric'},{value:'sys_num',text:'sys_num'},{value:'fstype',text:'fstype'},{value:'device',text:'device'},{value:'path',text:'path'},{value:'mode',text:'mode'},
{value:'free',text:'free'},{value:'total',text:'total'},{value:'used',text:'used'}                
,{value:'used_percent',text:'used_percent'},{value:'inodes_free',text:'inodes_free'},{value:'inodes_total',text:'inodes_total'},{value:'inodes_used',text:'inodes_used'}]; 

const diskIolist = [{value:'',text:'Choose metric'},{value:'sys_num',text:'sys_num'},{value:'name',text:'name'},{value:'serial',text:'serial'},{value:'reads',text:'reads'},{value:'writes',text:'writes'},{value:'read_bytes',text:'read_bytes'},
{value:'write_bytes',text:'write_bytes'}, {value:'read_time',text:'read_time'}, {value:'write_time',text:'write_time'},{value:'io_time',text:'io_time'}];

const dockerlist = [{value:'',text:'Choose metric'},{value:'sys_num',text:'sys_num'},{value:'unit',text:'unit'},{value:'engine_host',text:'engine_host'},{value:'n_used_file_descriptors',text:'n_used_file_descriptors'},{value:'n_cpus',text:'n_cpus'},
{value:'n_containers',text:'n_containers'},{value:'n_containers_running',text:'n_containers_running'},{value:'n_containers_stopped',text:'n_containers_stopped'}
,{value:'n_containers_paused',text:'n_containers_paused'},{value:'n_images',text:'n_images'},{value:'n_goroutines',text:'n_goroutines'},{value:'memory_total',text:'memory_total'}];

const internetlist = [{value:'',text:'Choose metric'},{value:'sys_num',text:'sys_num'},{value:'Upload',text:'Upload'},{value:'Download',text:'Download'},{value:'Latency',text:'Latency'}];

const postgreslist = [{value:'',text:'Choose metric'},{value:'sys_num',text:'sys_num'},{value:'datid',text:'datid'},{value:'datname',text:'datname'},{value:'numbackends',text:'numbackends'},{value:'xact_commit',text:'xact_commit'},{value:'xact_rollback',text:'xact_rollback'},
{value:'blks_read',text:'blks_read'},{value:'blks_hit',text:'blks_hit'},{value:'tup_returned',text:'tup_returned'},{value:'tup_fetched',text:'tup_fetched'},{value:'tup_inserted',text:'tup_inserted'},{value:'tup_deleted',text:'tup_deleted'},
{value:'temp_files',text:'temp_files'},{value:'temp_bytes',text:'temp_bytes'},{value:'blk_readtime',text:'blk_readtime'},{value:'blk_writetime',text:'blk_writetime'}];

const systemList = [{value:'',text:'Choose metric'},{value:'sys_num',text:'sys_num'},{value:'load1',text:'load1'},{value:'load15',text:'load15'},{value:'load5',text:'load5'},{value:'n_users',text:'n_users'},{value:'n_cpus',text:'n_cpus'},
{value:'uptime',text:'uptime'}];

const wirelessList = [{value:'',text:'Choose metric'},{value:'sys_num',text:'sys_num'},{value:'interface',text:'interface'},{value:'status',text:'status'},{value:'link',text:'link'},{value:'level',text:'level'},{value:'noise',text:'noise'},
{value:'nwid',text:'nwid'},{value:'crypt',text:'crypt'},{value:'frag',text:'frag'},{value:'retry',text:'retry'},{value:'misc',text:'misc'},{value:'missed_beacon',text:'missed_beacon'}];

const [processname, setprocessname] = useState('');
    const [metricname, setMetricName] = useState('');
    const [threshold, setThreshold] = useState('');
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
            fetch('http://localhost:3001/venues/add', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({processname,metricname,threshold}),
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
          <Button type='submit' >Set Threshold</Button>
        </Form>
      </Container>
    
      );
}

export default ThresholdForm;