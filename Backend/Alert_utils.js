
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

const list_alerts = async (req,res) => {
    const user_id = parseInt(req.params.id);
    const query1 = `
    SELECT user_id as user, process, metric, threshold from checks
    where user_id = $1
    `;
    try{
        var rows = await connection.query(query1,[user_id]);
        rows = rows["rows"];
        var x = {"alerts": rows};
        res.send(x);
    }
    catch(err)
    {
        console.log(err);
    }
}


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


const add_check = async (req, res) => {
    console.log(req.body)
    var metric = req.body.metricname;
    var threshold_val = parseInt(req.body.threshold);
    var user_id = req.body.user;
    var process = req.body.processname;

    const query = `
    insert into checks(user_id,process,metric,threshold) values ($1,$2,$3,$4)
    `
    try {

        const rows = await connection.query(query, [user_id, process, metric, threshold_val])
        var x = { status: "New Threshold check Added", proceed: 1 };
        console.log("New Threshold Check Added");
        res.send(x);

    }
    catch (err) {
        console.log(err);
    }
}

const check_data = async (req, res) => {
    var user_id = parseInt(req.body.user);
    var process = req.body.process;
    var metric = req.body.metric;
    var threshold = parseInt(req.body.threshold);

    const query1 = `
        UPDATE checks
        SET last_update = $4
        WHERE user_id = $1 and process = $2 and metric = $3;
        `;

    const query2 = `
        select last_update from checks
        where user_id = $1 and process = $2 and metric = $3 ;
        `;
    
    const query3 = `
        INSERT INTO alerts(user_id,alert) VALUES ($1,$2);
    `;

    try {
        var rows1 = await connection.query(query2, [user_id,process,metric]);
        const recent_update = rows1["rows"][0]["last_update"];
    
        console.log(recent_update,"---");
    
        var l = [];
        new_start = recent_update;
        const fluxQuery = `from(bucket: "${bucket}")\
        |> range(start: ${recent_update} )\
        |> filter(fn: (r) => r["_measurement"] == "${process}")
        |> filter(fn: (r) => r["_field"] == "${metric}")`;

        queryApi.queryRows(fluxQuery, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row)
                
                var x1 = o._value;
                var t1 = o._time;

                new_start = t1;
                console.log(`val: ${x1}, threshold: ${threshold}`);
                if(x1 > threshold){
                    var x2 = `Metric ${metric} of process ${process} has value ${x1} greater than threshold ${threshold} at time ${t1} `;
                    try{
                        var __ = connection.query(query3,[user_id,x2]);        // ** CHECK THIS **
                    }
                    catch(err){
                        console.log(err);
                    }    
                    l.push(x2);
                    console.log(x2);
                }
            },
            error(error) {
                console.error(error)
                console.log('\nFinished ERROR')
            },
            complete() {
                res.send({"alerts":l});
            },

        });  
    }
    catch (err) {
      console.log(err);
      res.send({"error": err});
    }
}
  
module.exports = {
    check_data,
    add_check,
    list_alerts
}