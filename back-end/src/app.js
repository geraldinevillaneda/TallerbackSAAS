const express = require('express');
const app =  express();
const morgan = require('morgan');
const cors = require('cors');
const PORT = process.env.PORT || 3128;
//Settings
app.set('port', PORT);


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