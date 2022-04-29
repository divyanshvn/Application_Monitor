'use strict'

const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const { response, query } = require('express');
const res = require('express/lib/response');
const { Client } = require('pg');
const { Connection } = require('pg');

// const INFLUX_ORG = "MyDB"
// const INFLUX_BUCKET = "MyBucket1"
// const INFLUX_TOKEN = "vOFwtnaq3Op08NBRo3JmLg21oA4Xcj_NV7FMOsFuwVfJ35DPzU77FWMkTMYv7HPe1s-hCxh4ulPdEweSDHV0SA=="
// const INFLUX_URL = "http://localhost:8086"

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

let l = [];

// const check_helper = async (i, n, time_start, rows2, fluxQuery, new_start) => {
//   queryApi.queryRows(fluxQuery, {
//     next(row, tableMeta) {
//       const o = tableMeta.toObject(row)
//       const process = rows2[i]["process"];
//       const metric = rows2[i]["metric"];
//       const threshold = rows2[i]["threshold"];

//       var x1 = o._value;
//       var t1 = o._time;
      
//       new_start = t1;

//       if(x1 > threshold){
//         l.push(`Metric ${metric} of process ${process} has value ${x1} greater than threshold ${threshold} at time ${t1} `);
//       }
//     },
//     error(error) {
//       console.error(error)
//       console.log('\nFinished ERROR')
//     },
//     complete() {
//       if(i == n-1){
//         return new_start;
//       }
//       var _x = await check_helper(i+1,n,time_start,rows2,fluxQuery, new_start);
//       // console.log('\nFinished SUCCESS');
//       return _x;
//     },

//   })
// }

var new_start = "-14w";

// const check_helper1 = async (fluxQuery, row, time_start) => {
//   var _y = await queryApi.queryRows(fluxQuery, {
//     next(row, tableMeta) {
//       const o = tableMeta.toObject(row)
//       const process = row["process"];
//       const metric = row["metric"];
//       const threshold = row["threshold"];

//       var x1 = o._value;
//       var t1 = o._time;
      
//       new_start = t1;

//       if(x1 > threshold){
//         l.push(`Metric ${metric} of process ${process} has value ${x1} greater than threshold ${threshold} at time ${t1} `);
//       }
//     },
//     error(error) {
//       console.error(error)
//       console.log('\nFinished ERROR')
//     },
//     complete() {
//       return;
//     },

//   });
//   return;
// }

const graph_data = (req, res) => {
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
      console.log('\nFinished SUCCESS');
    },
  });

}

const add_check = async (req, res) => {
  var metric = req.body.measurement;
  var threshold_val = parseInt(req.body.value);
  var user_id = req.body.user;
  var process = req.body

  const query = `
    insert into checks(user_id,process,metric,value) values ($1,$2,$3,$4)
  `
  try {

    const rows = await connection.query(query, [user_id, process, metric, threshold_val])
    var x = { status: "New Threshold check Added", proceed: 1 };
    res.send(x);

  }
  catch (err) {
    console.log(err);
  }
}

// const check_data = async (req, res) => {
//   var user_id = parseInt(req.body.id);

//   const query1 = `
//     UPDATE users
//     SET last_update = $2
//     WHERE user_id = $1;
//     `;

//   const query2 = `
//     select last_update from users
//     where user_id = $1;
//     `;

//   const query3 = `
//     select process, metric, threshold
//     from checks
//     where user_id = $1;
//     `

//   try {
//     var rows1 = await connection.query(query2, [user_id]);
//     const recent_update = rows1["rows"][0];

//     var rows2 = await connection.query(query3, [user_id]);
//     rows2 = rows2["rows"];

//     const fluxQuery = `from(bucket: "${bucket}")\
//       |> range(start: ${time_start} )\
//       |> filter(fn: (r) => r["_measurement"] == "${process}")
//       |> filter(fn: (r) => r["_field"] == "${metric}")`

//     l = [];
//     for(var i = 0; i < rows2.length; i++){
//       var _x = await check_helper1(fluxQuery,rows2[i],time_start);
//     }
    

//   }
//   catch (err) {
//     console.log(err);
//   }
// }

module.exports = {
  graph_data,
  // add_check,
  // check_data
}