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
  password: 'king.1234',
  port: 5432
})
connection.connect();

var new_start = "-14w";

const check_helper1 = async ( row, time_start) => {
  var x2 = [];
  const process = row["process"];
  const metric = row["metric"];
  const threshold = row["threshold"];

  const fluxQuery = `from(bucket: "${bucket}")\
  |> range(start: ${time_start} )\
  |> filter(fn: (r) => r["_measurement"] == "${process}")
  |> filter(fn: (r) => r["_field"] == "${metric}")`;

  // console.log(fluxQuery);

  var _y = await queryApi.queryRows(fluxQuery, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row)
      
      var x1 = o._value;
      var t1 = o._time;
      // console.log(`${t1} : ${x1}`);

      new_start = t1;
      
      if(x1 > threshold){
        x2.push(`Metric ${metric} of process ${process} has value ${x1} greater than threshold ${threshold} at time ${t1} `);
        // console.log(`Metric ${metric} of process ${process} has value ${x1} greater than threshold ${threshold} at time ${t1} `);
      }
    },
    error(error) {
      console.error(error)
      console.log('\nFinished ERROR')
    },
    complete() {
      return x2;
    },

  });

}

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
  var metric = req.body.metricname;
  var threshold_val = parseInt(req.body.threshold);
  var user_id = req.body.user;
  var process = req.body.processname;
  var bucket = req.body.nodename;

  const query = `
    insert into checks(user_id,system,process,metric,threshold) values ($1,$2,$3,$4,$5)
  `
  try {

    const rows = await connection.query(query, [user_id, bucket, process, metric, threshold_val])
    var x = { status: "New Threshold check Added", proceed: 1 };
    res.send(x);

  }
  catch (err) {
    console.log(err);
  }
}

const check_data = async (req, res) => {
  // console.log(req.params.id);
  // console.log("HELLLLLLOOOOO");
  var user_id = parseInt(req.body.id);

  const query1 = `
    UPDATE users
    SET last_update = $2
    WHERE user_id = $1;
    `;

  const query2 = `
    select last_update from users
    where user_id = $1;
    `;

  const query3 = `
    select process, metric, threshold
    from checks
    where user_id = $1;
    `

  try {
    console.log("Hello");
    var rows1 = await connection.query(query2, [user_id]);
    const recent_update = rows1["rows"][0]["last_update"];

    // const recent_update = "-14";
    console.log(recent_update,"---");
    var rows2 = await connection.query(query3, [user_id]);
    rows2 = rows2["rows"];

    var l = [];
    new_start = recent_update;
    console.log(rows2.length);
    rows2.forEach(async(x) => {
      var _x = await check_helper1(x,recent_update,l);
      console.log(_x);
    });
    // for(var i = 0; i < rows2.length; i++){
    //   const _x = await check_helper1(rows2[i],recent_update);
    //   console.log(_x);
    // }

    // var rows3 = await connection.query(query1,[user_id,new_start]);
    res.send({"alerts":l});

    return;
    
  }
  catch (err) {
    console.log(err);
  }
}

// module.exports = {
//   graph_data,
//   add_check,
//   check_data,
// }


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
