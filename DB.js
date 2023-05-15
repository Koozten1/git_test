const mysql = require("mysql2");

const conn = mysql.createConnection({
     port: "3306",
     user: "gen_user",
     host: "185.154.192.193",
     database: "default_db",
     password: "root1234"
});


conn.connect((err) =>{
    if(err){
        console.log(err)
    }

    else{
        console.log('connect_secsess')
    }
});

module.exports = conn

