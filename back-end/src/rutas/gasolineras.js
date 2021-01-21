//

const express = require('express');
const router = express.Router();

const connection = require('../database');

router.get('/',(req, res)=>{
    connection.query('SELECT * FROM gasolineras', (error, rows, fields)=>{
        if(!error){
            console.log(rows);
            res.json({data:rows});
        }else{
            console.log(error);
        }
    })
})
module.exports = router;