import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Form, FormGroup, Button } from "react-bootstrap";
import ErrorMessage from "./errorMessage";
import axios from 'axios';
import AuthService from "./services/auth.service";
import { useNavigate } from "react-router-dom";

function AlertList() {

    const [gotlist, setGotList] = useState([]);
    const [nowcall, setNowCall] = useState(false);
    const [finalData, setFinalData] = useState([]);
    const user = AuthService.getCurrentUser()["id"];
    var lists = [];
    /*useEffect(() => {
        setInterval(() => {
            fetch(`http://localhost:3001/list_checks/${user}`)
                .then(res => res.json())
                .then(data => {

                    setGotList(data["alerts"]);
                    setNowCall(true);
                })

        }, 3000)

    }, [])*/

    /*if (nowcall) {
        gotlist.map((item, index) => {
            fetch('http://localhost:3001/check/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "user": item["user"],
                    "process": item["process"],
                    "metric": item["metric"],
                    "threshold": item["threshold"]
                }),
            })
                .then(res => res.json())
                .then(data => {
                    setFinalData(data);
                    data = data["alerts"];
                    for (var i4 = 0; i4 < data.length; i4++) {
                        lists.push(data[i4]);
                    }
                })
                .catch(error => {
                    console.error("There was an Error", error);
                });
        })

    }*/

    return (<div>
        <div className="alerttitle">Alerts</div>
        {/*lists.map((item, index) => {
            <div style={{ color: "white" }}>monu</div>
        })*/}
    </div>)
}


export default AlertList;