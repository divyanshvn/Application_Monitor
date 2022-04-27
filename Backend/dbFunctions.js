'use strict'

const {InfluxDB,Point} = require('@influxdata/influxdb-client');
const {response,query} = require('express');
const res = require('express/lib/response');

// const INFLUX_ORG = "MyDB"
// const INFLUX_BUCKET = "MyBucket1"
// const INFLUX_TOKEN = "vOFwtnaq3Op08NBRo3JmLg21oA4Xcj_NV7FMOsFuwVfJ35DPzU77FWMkTMYv7HPe1s-hCxh4ulPdEweSDHV0SA=="
// const INFLUX_URL = "http://localhost:8086"

const url = process.env.INFLUX_URL || ''
const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG || ''

const queryApi = new InfluxDB({url,token}).getQueryApi(org)

const graph_data = (req,res)=>{
    
    const fluxQuery = 'from(bucket: "MyBucket1")\
    |> range(start: -10w)\
    |> filter(fn: (r) => r["_measurement"] == "boltdb_reads_total")'

    // ret_obj = {}
    let x = []
    let time_x = []
    queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
            const o = tableMeta.toObject(row)
            // console.log(o);
            x.push(o._value);
            // for(var i = 0; i < 3; i++)
            //     console.log(x[i]);
            
            // console.log("NEW");
            // console.log(typeof(o._value));
            time_x.push(o._time);
        //   console.log(
        //     `${o._time} ${o._measurement} : ${o._field}=${o._value}`
        //   )        
            
        },
        error(error) {
        console.error(error)
          console.log('\nFinished ERROR')
        },
        complete() {
            res.send({"time":time_x, "vals":x});
            console.log('\nFinished SUCCESS')
        },
    });
    // console.log("NICE\n");
    // for(var i = 0; i < 10; i++){
    //     console.log(x[i]);
    // }
    
}

module.exports = {
    graph_data,
}