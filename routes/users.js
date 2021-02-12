const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const express = require('express');
const router = express.Router();

const connection = require('../database');
const texto = require('../config');
const verify = require('./verifyToken')

//Crear Token
const crearToken = (user) => {
    let payload = {
        userId: user.id,
        createdAt: moment().unix(),
        expiresAt: moment().add(1,'day').unix()
    }
    return jwt.sign(payload, texto.secreto)
    //return jwt.encodes(payload, process.env,TOKEN_KEY);
}


router.get('/',(req, res)=>{
    connection.query('SELECT * FROM usuarios', (error, rows, fields)=>{
        if(!error){
            res.json(rows);
        }else{
            console.log(error);
        }
    });
});

router.post('/agregar', (req, res) =>{
    const { id, nombre_usuario, tipo_documento, sexo_usuario, nacionalidad_usuario, telefono_usuario,
        direccion_usuario, clave_usuario } = req.body;
    const nuevoUsuario = {
        id,
        nombre_usuario,
        tipo_documento,
        sexo_usuario,
        nacionalidad_usuario,
        telefono_usuario,
        direccion_usuario,
        clave_usuario
    };
    nuevoUsuario.clave_usuario = bcrypt.hashSync(nuevoUsuario.clave_usuario, 10);
    console.log(nuevoUsuario);
    connection.query('insert into usuarios set ?', [nuevoUsuario]);
    res.json('usuario received');
});


router.get('/delete/:id', async( req, res)=>{
    const { id } = req.params;
    await connection.query('delete from usuarios where id = ?', [id]);
    res.json('usuario deleted');

});

router.post('/update/:id', (req, res)=>{
    const { id } = req.params;
    const { nombre_usuario, tipo_documento, sexo_usuario, nacionalidad_usuario, telefono_usuario,
            direccion_usuario, clave_usuario } = req.body;
    const actualizarE = {
        nombre_usuario,
        tipo_documento,
        sexo_usuario,
        nacionalidad_usuario,
        telefono_usuario,
        direccion_usuario,
        clave_usuario
    };

    connection.query('update usuarios set ? where id = ?', [actualizarE, id]);
    res.json({Status: 'Estacion updated'});

});

const getbyId = (id) => {
    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM usuarios where id = ?',
        [id], 
        (err, rows) => {
            if(err) reject(err)
            resolve(rows[0])
        });
    });
};

router.get('/me', verify, async (req, res, next) => {
    const user  = await getbyId(req.userId, {clave_usuario: 0});
    
    if(!user){
        return res.status(404).send("Usuario no Encontrado");
    }

    res.json(user);   

})

const getbyUser = (usuario) => {
    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM usuarios where nombre_usuario = ?',
        [usuario], 
        (err, rows) => {
            if(err) reject(err)
            resolve(rows[0])
        });
    });
};


router.post('/login', async(req, res) => {

    const user = await getbyUser(req.body.nombre_usuario);
    if(user === undefined)
    {
        res.json({
            error: 'Error, User or Password not found'
        });
    }
    else
    {
        const equals = bcrypt.compareSync(req.body.clave_usuario, user.clave_usuario);
        //const equals = (req.body.clave_usuario === user.clave_usuario);
        if(!equals)
        {
            res.json({
                error: 'Error, User or Password not found'
            });
        }
        else
        {
            res.json({
                succesfull: crearToken(user),
                done: 'Login correct'
            })
        }
    }
});


module.exports = router;