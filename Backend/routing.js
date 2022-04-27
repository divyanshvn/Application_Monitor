const express = require('express');
const router = express.Router();
const dbFunctions = require('./dbFunctions')

router.get('/graph/:metric/:feature', dbFunctions.graph_data)

module.exports = router;