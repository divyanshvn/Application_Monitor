
'use strict'

const { InfluxDB, Point, DEFAULT_ConnectionOptions, consoleLogger } = require('@influxdata/influxdb-client');
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

const list_alerts = async (req,res) => {
    const user_id = parseInt(req.params.id);
    const query1 = `
    SELECT user_id as user, process, metric, threshold from checks
    where user_id = $1
    `;
    // console.log(user_id);
    try{
        // console.log(query1,user_id);
        var rows = await connection.query(query1,[user_id]);
        rows = rows["rows"];
        // console.log(rows);
        var x = {"alerts": rows};
        res.send(x);
    }
    catch(err)
    {
        console.log(err);
    }
    // res.send({"alerts":[]})
}

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


const add_check = async (req, res) => {
    console.log(req.body)
    var metric = req.body.metricname;
    var threshold_val = parseInt(req.body.threshold);
    var user_id = req.body.user;
    var process = req.body.processname;

    // console.log(`${threshold_val}, ${user_id} TERRE`);
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
    // console.log(req.params.id);
    // console.log("HELLLLLLOOOOO");
    // console.log("TYTYTTYT");
    var user_id = parseInt(req.body.user);
    var process = req.body.process;
    var metric = req.body.metric;
    var threshold = parseInt(req.body.threshold);

    // console.log(`threshold: ${threshold}, user_id: ${user_id}`);
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
        // console.log(rows1["rows"],`${user_id},${process},${metric}`);
        const recent_update = rows1["rows"][0]["last_update"];
    
        // const recent_update = "-14";
        console.log(recent_update,"---");
        // var rows2 = await connection.query(query3, [user_id]);
        // rows2 = rows2["rows"];
    
        var l = [];
        new_start = recent_update;
        const fluxQuery = `from(bucket: "${bucket}")\
        |> range(start: ${recent_update} )\
        |> filter(fn: (r) => r["_measurement"] == "${process}")
        |> filter(fn: (r) => r["_field"] == "${metric}")`;

        // console.log(fluxQuery);

        queryApi.queryRows(fluxQuery, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row)
                
                var x1 = o._value;
                var t1 = o._time;
                // console.log(`${t1} : ${x1}`);

                new_start = t1;
                console.log(`val: ${x1}, threshold: ${threshold}`);
                if(x1 > threshold){
                    var x2 = `Metric ${metric} of process ${process} has value ${x1} greater than threshold ${threshold} at time ${t1} `;
                    try{
                        var __ = connection.query(query3,[user_id,x2]);        // ** CHECK THIS **
                        // console.log("------------");
                    }
                    catch(err){
                        console.log(err);
                        // console.log("-----------------------");
                        // res.send({"error":err});
                    }    
                    l.push(x2);
                    console.log(x2);
                    // console.log(`Metric ${metric} of process ${process} has value ${x1} greater than threshold ${threshold} at time ${t1} `);
                }
            },
            error(error) {
                console.error(error)
                console.log('\nFinished ERROR')
            },
            complete() {
                // connection.query(query1,[user_id,process,metric,new_start],(err,rows)=>{
                //     if(err){
                //         console.log(err);
                //     }
                // });
                res.send({"alerts":l});
            },

        });

        // console.log(rows2.length);
    //   rows2.forEach(async(x) => {
    //     var _x = await check_helper1(x,recent_update,l);
    //     console.log(_x);
    //   });
        
      // for(var i = 0; i < rows2.length; i++){
      //   const _x = await check_helper1(rows2[i],recent_update);
      //   console.log(_x);
      // }
  
      // var rows3 = await connection.query(query1,[user_id,new_start]);
      
    }
    catch (err) {
      console.log(err);
      res.send({"error": err});
    }
}

// const delete_alert = async (req,res)=>{
//     var metric = req.body.metric;
//     var threshold_val = parseInt(req.body.value);
//     var user_id = req.body.user;
//     var process = req.body.process;


    
// }
  
module.exports = {
    check_data,
    add_check,
    list_alerts
}