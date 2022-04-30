const express = require('express');
const routes = require('./routing');
const app = express();
const cors = require('cors')
// Config
const PORT = 3001;
const hostname = '127.0.0.1';

app.use(cors())
app.use(express.json())

// Different route setups
app.use(routes);
app.listen(PORT,(req,res)=>{
    console.log(`Server is running at Port ${PORT}`);
})