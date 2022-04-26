const Pool =require('pg').Pool;
require('dotenv').config();
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});



const handle_query = () => {
    return new Promise((resolve,reject) => {
        pool.query('select sum(runs_scored + extra_runs) as runs,match_id as match FROM ball_by_ball group by match_id order by match_id;',(error,results)=>{
                if(error){
                    reject(error);
                }
                resolve(results);
            });
    });
};


module.exports = {
    handle_query
}