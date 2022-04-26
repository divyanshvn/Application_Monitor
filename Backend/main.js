const { response } = require('express');
const express = require('express');
const app = express();
const port = 3001;
const ptest = require('./postgres_test.js');


app.use(express.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
  });

  app.get('/',(req,res)=>{
   // console.log(30);
    ptest.handle_query()
    .then(response => {
        // console.log(response.rows)
        res.status(200).send(response.rows);
      })
    .catch(error => {
        res.status(500).send(error);
      })
  }
  );

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

