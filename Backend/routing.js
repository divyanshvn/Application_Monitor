const express = require('express');
const router = express.Router();
const dbFunctions = require('./dbFunctions')
const UserFunctions = require('./userFunctions')

router.get('/graph/:process/:metric/:time_start/:time_end', dbFunctions.graph_data)
// router.post('/add_check/', dbFunctions.add_check)
router.post('/user/register/', UserFunctions.register_user)
router.post('/user/login', UserFunctions.userAuth)
// router.post('/check/', dbFunctions.check_data)

module.exports = router;