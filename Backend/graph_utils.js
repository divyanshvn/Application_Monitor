'use strict'

const { InfluxDB, Point, DEFAULT_ConnectionOptions, consoleLogger } = require('@influxdata/influxdb-client');
const { response, query } = require('express');
const res = require('express/lib/response');
const { Client } = require('pg');
const { Connection } = require('pg');

// influxdb
const url = process.env.INFLUX_URL || ''
const token = process.env.INFLUX_API_TOKEN
const org = process.env.INFLUX_ORG || ''
const bucket = process.env.INFLUX_BUCKET || ''

var new_start = "-14w";
const queryApi = new InfluxDB({ url, token }).getQueryApi(org)

// postgresql
const connection = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'userdb',
  password: 'root',
  port: 5432
})
connection.connect();

const graph_data = async (req, res) => {
    var process = (req.params.process);
    var metric = (req.params.metric);
    var time_start = req.params.time_start;
    var time_end = req.params.time_end;
  
    const fluxQuery = `from(bucket: "${bucket}")\
    |> range(start: ${time_start}, stop: ${time_end} )\
    |> filter(fn: (r) => r["_measurement"] == "${process}")
    |> filter(fn: (r) => r["_field"] == "${metric}")`
  
    // const fluxQuery = 'from(bucket: "MyBucket1")\
    //   |> range(start: -10w, stop : -4m) \
    //   |> filter(fn: (r) => r["_measurement"] == "boltdb_reads_total")'
  
    // ret_obj = {}
    let x = []
    let time_x = []
    let ret_x = []
  
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row)
        // console.log(`${o._measurement} , ${o._value}, ${o._field}`)
  
        x.push(o._value);
        time_x.push(o._time);
        ret_x.push({
          "time": o._time,
          "value": o._value
        });
        // console.log(
        //   `${o._time} ${o._measurement} : ${o._field}=${o._value}`
        // )
  
      },
      error(error) {
        console.error(error)
        console.log('\nFinished ERROR')
      },
      complete() {
        console.log(fluxQuery);
        res.send({ "time": time_x, "value": x });
        console.log(x);
        console.log('\nFinished SUCCESS');
      },
    });
  
}

// const list_graphs = async (req,res) => {
//     const user_id = req.body.id;
//     const query1 = `
//     SELECT process, metric, time_start, time_end
//     from graphs
//     where user_id = user_id
//     `;

//     const rows = await connection.query(query1);
//     rows = rows["rows"];


// }

module.exports = {
    graph_data,

}