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

const check_helper = async (i, n, time_start, rows2, fluxQuery, l) => {
  queryApi.queryRows(fluxQuery, {
    next(row, tableMeta) {
      
    }
  })
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
      console.log('\nFinished SUCCESS')
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
    var rows1 = await connection.query(query2, [user_id]);
    const recent_update = rows1["rows"][0];

    var rows2 = await connection.query(query3, [user_id]);
    rows2 = rows2["rows"];

    var l = [];
    const fluxQuery = `from(bucket: "${bucket}")\
      |> range(start: ${time_start} )\
      |> filter(fn: (r) => r["_measurement"] == "${process}")
      |> filter(fn: (r) => r["_field"] == "${metric}")`

    for (var i = 0; i < rows2.length; i++) {
      { }
    }

  }
  catch (err) {
    console.log(err);
  }
}

module.exports = {
  graph_data,
  add_check,
}