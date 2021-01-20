const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'geoportal'
});

connection.connect((error)=>{
    if(error){
        console.log(error);
        return;
    }else{
        console.log('DB is connected');
    }
});

module.exports = connection;
