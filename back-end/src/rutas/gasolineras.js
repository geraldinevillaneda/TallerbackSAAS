//

const express = require('express');
const router = express.Router();

const connection = require('../database');

router.get('/',(req, res)=>{
    connection.query('SELECT * FROM gasolineras', (error, rows, fields)=>{
        if(!error){
            res.json(rows);
        }else{
            console.log(error);
        }
    })
})
module.exports = router;