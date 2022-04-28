'use strict'

const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const { response, query } = require('express');
const res = require('express/lib/response');
const { Connection } = require('pg');

// const INFLUX_ORG = "MyDB"
// const INFLUX_BUCKET = "MyBucket1"
// const INFLUX_TOKEN = "vOFwtnaq3Op08NBRo3JmLg21oA4Xcj_NV7FMOsFuwVfJ35DPzU77FWMkTMYv7HPe1s-hCxh4ulPdEweSDHV0SA=="
// const INFLUX_URL = "http://localhost:8086"

let checks = {};

const url = process.env.INFLUX_URL || ''
const token = process.env.INFLUX_API_TOKEN
const org = process.env.INFLUX_ORG || ''

const queryApi = new InfluxDB({ url, token }).getQueryApi(org)

const graph_data = (req, res) => {
  var process = (req.params.process);
  var metric = (req.params.metric);
  var time_start = req.params.time_start;
  var time_end = req.params.time_end;

  const fluxQuery = `from(bucket: "InsertData1")\
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

const add_check = (req, res) => {
  var check_meas = req.body.measurement;
  var check_val = parseInt(req.body.value);
  var user_id = req.body.user;

  const query = `
    insert into checks(user_id,metric,value) values ($1,$2,$3)
  `
  Connection.query()

  var x = { status: "New Threshold check Added" };
  res.send(x);

}


module.exports = {
  graph_data,
  add_check,
}