/* Esta es una tarea de desestructuración. Es una expresión de JavaScript que hace posible descomprimir
valores de matrices o propiedades de objetos en distintas variables. */
const {Router}= require('express');
const router = Router();

/* Importando las funciones desde el archivo index.controllers.js. */
const { getCategoria }=require('../controllers/categoria.controlles');
const { getCategoriaById }=require('../controllers/categoria.controlles');
const { createCategoria}=require('../controllers/categoria.controlles');
const { updateCategoria }=require('../controllers/categoria.controlles');
const { deleteCategoria}=require('../controllers/categoria.controlles');

/* El código anterior crea un objeto de enrutador y luego usa el objeto de enrutador para crear rutas
para la API. */
router.get('/',getCategoria);
router.get('/:id', getCategoriaById);
router.post('/', createCategoria);
router.put('/:id', updateCategoria);
router.delete('/:id', deleteCategoria);



/* Esta es una forma de exportar el objeto del enrutador para que pueda usarse en otros archivos. */
module.exports=router;