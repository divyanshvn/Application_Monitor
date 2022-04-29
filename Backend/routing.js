const express = require('express');
const router = express.Router();
// const dbFunctions = require('./dbFunctions')
const UserFunctions = require('./userFunctions')
const graphFunc = require('./graph_utils')
const AlertFunc = require('./Alert_utils')

router.get('/graph/:process/:metric/:time_start/:time_end', graphFunc.graph_data)
router.post('/add_check/', AlertFunc.add_check)
router.post('/user/register/', UserFunctions.register_user)
router.post('/user/login', UserFunctions.userAuth)
router.post('/check/', AlertFunc.check_data)
router.get('/list_checks/:id', AlertFunc.list_alerts)
module.exports = router;