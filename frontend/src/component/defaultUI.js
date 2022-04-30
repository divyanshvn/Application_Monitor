import React, { useEffect }  from "react";
import { useState } from "react";
import { Container, Form, FormGroup,Button } from "react-bootstrap";
import ErrorMessage from "./errorMessage";
import axios from 'axios';
import AuthService from "./services/auth.service";
import { useNavigate } from "react-router-dom";
import DefaultGraph from "./defaultGraph";

function DefaultUI() {
     return(
         <div>
             <div className="dashboard">Dashboard</div>
             <div>
              <div className="defaulttitle">Monitoring Local</div>
             <div className="defaultui">
             <div className="defaultgraph">
             <DefaultGraph sendval={{metric:"usage_idle",process:"cpu",starttime:"-4m",endtime:"-1s",graphtitle:"Usage idle for Cpu",yaxis:"Value",backgroundcolor:"pink",node:"Bucket_0"}}/>
             </div>
             <div className="defaultgraph">
             <DefaultGraph sendval={{metric:"used_percent",process:"disk",starttime:"-4m",endtime:"-1s",graphtitle:"Used Percent Of Disk",yaxis:"% of disk",backgroundcolor:"blue",node:"Bucket_0"}}/>
             </div>
             </div>
             <div className="defaultui">
             <div className="defaultgraph">
             <DefaultGraph sendval={{metric:"usage_iowait",process:"cpu",starttime:"-4m",endtime:"-1s",graphtitle:"Usage iowait for Cpu",yaxis:"Value",backgroundcolor:"green",node:"Bucket_0"}}/>
             </div>
             <div className="defaultgraph">
             <DefaultGraph sendval={{metric:"read_bytes",process:"diskio",starttime:"-4m",endtime:"-1s",graphtitle:"Read Bytes from DiskIo",yaxis:"Bytes",backgroundcolor:"red",node:"Bucket_0"}}/>
             </div>
             </div>
             </div>
             <div>
              <div className="defaulttitle">Monitoring System 1</div>
             <div className="defaultui">
             <div className="defaultgraph">
             <DefaultGraph sendval={{metric:"usage_idle",process:"cpu",starttime:"-4m",endtime:"-1s",graphtitle:"Usage idle for Cpu",yaxis:"Value",backgroundcolor:"pink",node:"Bucket_1"}}/>
             </div>
             <div className="defaultgraph">
             <DefaultGraph sendval={{metric:"used_percent",process:"disk",starttime:"-4m",endtime:"-1s",graphtitle:"Used Percent Of Disk",yaxis:"% of disk",backgroundcolor:"blue",node:"Bucket_1"}}/>
             </div>
             </div>
             <div className="defaultui">
             <div className="defaultgraph">
             <DefaultGraph sendval={{metric:"usage_iowait",process:"cpu",starttime:"-4m",endtime:"-1s",graphtitle:"Usage iowait for Cpu",yaxis:"Value",backgroundcolor:"green",node:"Bucket_1"}}/>
             </div>
             <div className="defaultgraph">
             <DefaultGraph sendval={{metric:"read_bytes",process:"diskio",starttime:"-4m",endtime:"-1s",graphtitle:"Read Bytes from DiskIo",yaxis:"Bytes",backgroundcolor:"red",node:"Bucket_1"}}/>
             </div>
             </div>
             </div>
             <div>
             <div className="defaulttitle">Monitoring System 2</div>
             <div className="defaultui">
             <div className="defaultgraph">
             <DefaultGraph sendval={{metric:"usage_idle",process:"cpu",starttime:"-4m",endtime:"-1s",graphtitle:"Usage idle for Cpu",yaxis:"Value",backgroundcolor:"pink",node:"Bucket_2"}}/>
             </div>
             <div className="defaultgraph">
             <DefaultGraph sendval={{metric:"used_percent",process:"disk",starttime:"-4m",endtime:"-1s",graphtitle:"Used Percent Of Disk",yaxis:"% of disk",backgroundcolor:"blue",node:"Bucket_2"}}/>
             </div>
             </div>
             <div className="defaultui">
             <div className="defaultgraph">
             <DefaultGraph sendval={{metric:"usage_iowait",process:"cpu",starttime:"-4m",endtime:"-1s",graphtitle:"Usage iowait for Cpu",yaxis:"Value",backgroundcolor:"green",node:"Bucket_2"}}/>
             </div>
             <div className="defaultgraph">
             <DefaultGraph sendval={{metric:"read_bytes",process:"diskio",starttime:"-4m",endtime:"-1s",graphtitle:"Read Bytes from DiskIo",yaxis:"Bytes",backgroundcolor:"red",node:"Bucket_2"}}/>
             </div>
             </div>
             </div>
         </div>
     )
}

export default DefaultUI;