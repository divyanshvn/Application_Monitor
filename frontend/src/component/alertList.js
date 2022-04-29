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
    useEffect(() => {
        setInterval(() => {
            fetch(`http://localhost:3001/list_checks/${user}`)
                .then(res => res.json())
                .then(data => {
                    // console.log(8);

                    setGotList(data["alerts"]);
                    setNowCall(true);
                    //console.log(data["alerts"], 43);
                })

        }, 3000)

    }, [])

    if (nowcall) {
        // console.log(133);
        // console.log(gotlist);
        gotlist.map((item, index) => {
            // console.log("helloo");
            // console.log(item)
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
                    //  console.log(data);
                    setFinalData(data);
                    // console.log(9);
                    // setGotList(data);
                    // console.log(data, 44);
                    data = data["alerts"];
                    console.log(data.length, "hrhrh");
                    for (var i4 = 0; i4 < data.length; i4++) {
                        // console.log(item1);
                        console.log(1)
                        lists.push(data[i4]);
                    }
                    console.log(lists, 123);
                })
                .catch(error => {
                    console.error("There was an Error", error);
                });
        })

    }

    return (<div>
        <div style={{ color: "white" }}>Hi</div>
        {lists.map((item, index) => {
            <div style={{ color: "white" }}>monu</div>
        })}
    </div>)
}


export default AlertList;