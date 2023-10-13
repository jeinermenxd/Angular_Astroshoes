/* Esta es una tarea de desestructuración. Es una expresión de JavaScript que hace posible descomprimir
valores de matrices o propiedades de objetos en distintas variables. */
const {Router}= require('express');
const router = Router();

/* Importando las funciones desde el archivo index.controllers.js. */
const { setRegister }=require('../controllers/login.controlles');
const { setLogin }=require('../controllers/login.controlles');


/* El código anterior crea un objeto de enrutador y luego usa el objeto de enrutador para crear rutas
para la API. */
router.post('/register',setRegister);
router.post('/login',setLogin);

/* Exportando el objeto del enrutador. */
module.exports=router;