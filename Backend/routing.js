const express = require('express');
const router = express.Router();
const dbFunctions = require('./dbFunctions')

router.get('/graph/:process/:metric/:time_start/:time_end', dbFunctions.graph_data)
router.post('/threshold_check/', dbFunctions.add_check)

module.exports = router;