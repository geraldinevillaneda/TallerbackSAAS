const express = require('express');
const app =  express();
const morgan = require('morgan');
const cors = require('cors');

//Settings
app.set('port', process.env.PORT || 3000);


//Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


//Routes
app.use('/get', require('./rutas/gasolineras'));
//Server init
app.listen(3000, () => {
    console.log('Server on port ', app.get('port'));
});