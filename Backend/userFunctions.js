const { response, query } = require('express');
const res = require('express/lib/response');
const { Client } = require('pg');
const bcrypt = require('bcrypt')

const connection = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'userdb',
    password: 'root',
    port: 5432
})

connection.connect();

async function findOne(email) {
    var query2 = `
        select * 
        from users 
        where email = $1;
    `;

    connection.query(query2, [email], (err, rows) => {
        if (err) {
            console.log(err);
        }

    })
}


const register_user = async (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    
    console.log(`Name: ${name} , password: ${password}, email: ${email}`);

    try{
        var query1 = `
            select * 
            from users 
            where email = $1;
        `;

        var rows1 = await connection.query(query1, [email])

        if (rows1["rows"].length != 0) {     /* Correct the empty checks */
            res.status(404)
            res.send({"status": "Email Already Exists", "proceed": 0})
            return;
        }

        const encrypt_pass = await bcrypt.hash(password, 10);

        const query2 = `
        insert into users(name,email,password) values ($1,$2,$3)
        `;

        var rows2 = await connection.query(query2, [name, email, encrypt_pass])

        var rows3 = await connection.query(query1, [email])
        var id1 = rows3["rows"][0].user_id;
        var name1 = rows3["rows"][0].name;
        console.log(`Id is ${id1}`);

        var x = { "status": "User Created", "id": id1 , "name" : name, "proceed": 1};
        res.send(x);
    }
    catch(err){
        console.log(err);
        res.send({"proceed":0, "status":err})
    }
}


const userAuth = async (req, res) => {
    var email = req.body.email;
    var pass = req.body.password;

    const query1 = `
        select *
        from users
        where email = $1
    `

    var rows = await connection.query(query1, [email]);
    if (rows["rows"].length == 0) {
        res.send({ "proceed": 0, "status": "Email does not exists" })
        return;
    }
    else {
        const validPass = await bcrypt.compare(pass, rows["rows"][0].password);
        if (!validPass) {
            return res.status(401).json({ error: 'Incorrect Password' });
        }
        else {
            var x = { "proceed": 1, "status": "nice", "id": rows["rows"][0].user_id,  "name": rows["rows"][0].name};
            res.send(x);
        }
    }

}

module.exports = {
    register_user,
    userAuth
}