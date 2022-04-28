const { response, query } = require('express');
const res = require('express/lib/response');
const { Client } = require('pg');
const bcrypt = require('bcrypt')

const connection = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'userDB',
    password: 'root',
    port: 5432
})

connection.connect();

const findOne = async function (email) {
    var query = `
        select * 
        from users 
        where email = $1;
    `;

    connection.query(query, [email], (err, rows) => {
        if (err) {
            console.log(err);
        }
        return // Check if empty
    })
}

const register_user = (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    const userExists = await findOne(email);
    if (userExists) {     /* Correct the empty checks */
        res.status(404)
    }

    // const salt = await bcrypt.genSalt(10);
    // const encrypt_pass = await bcrypt.hash(password, salt);

    const query = `
    insert into users(name,email,password) values ($1,$2,$3)
    `;

    connection.query(query, [name, email, password], (err, rows) => {
        if (err) {
            console.log(err);
        }
        var x = { status: "User Created" };
        res.send(x);
    })
}

const userAuth = (req, res) => {
    var email = req.body.email;
    var pass = req.body.password;

    const query1 = `
        select email, password 
        from users
        where email = $1 and password = $2
    `

    connection.query(query1, [email, pass], (err, rows) => {
        if (err) {
            console.log(err);
        }
        if (rows.notEmpty()) {
            res.send({ status: "Yes", id: rows[0] });
        }
        else {
            res.send({ status: "No" })
        }
    })
}

