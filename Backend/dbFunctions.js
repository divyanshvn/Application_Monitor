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


  var _y = await queryApi.queryRows(fluxQuery, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row)
      
      var x1 = o._value;
      var t1 = o._time;

      new_start = t1;
      
      if(x1 > threshold){
        x2.push(`Metric ${metric} of process ${process} has value ${x1} greater than threshold ${threshold} at time ${t1} `);
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

  let x = []
  let time_x = []
  let ret_x = []

  queryApi.queryRows(fluxQuery, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row)

      x.push(o._value);
      time_x.push(o._time);
      ret_x.push({
        "time": o._time,
        "value": o._value
      });

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
    res.send({"alerts":l});

    return;
    
  }
  catch (err) {
    console.log(err);
  }
}
