/* Esta es una tarea de desestructuración. Es una expresión de JavaScript que hace posible descomprimir
valores de matrices o propiedades de objetos en distintas variables. */
const {Router}= require('express');
const router = Router();

/* Importando las funciones desde el archivo index.controllers.js. */
const { getResenas }=require('../controllers/resena.controlles');
const { create_resenas }=require('../controllers/resena.controlles');
const { getResenaById }=require('../controllers/resena.controlles');

/* El código anterior crea un objeto de enrutador y luego usa el objeto de enrutador para crear rutas
para la API. */
router.get('/',getResenas);
router.post('/', create_resenas);
router.get('/:id', getResenaById);


/* Esta es una sintaxis de Node.js que hace que el objeto del enrutador en el archivo sea accesible
para otros archivos. */
module.exports=router;