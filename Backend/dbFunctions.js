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

    queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row)
          console.log(
            `${o._time} ${o._measurement} : ${o._field}=${o._value}`
          )        
        },
        error(error) {
        console.error(error)
          console.log('\nFinished ERROR')
        },
        complete() {
          console.log('\nFinished SUCCESS')
        },
    });
    res.send({'rend':2})
}

module.exports = {
    graph_data,
}