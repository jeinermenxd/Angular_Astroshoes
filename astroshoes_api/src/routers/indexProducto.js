/* Esta es una tarea de desestructuración. Es una expresión de JavaScript que hace posible descomprimir
valores de matrices o propiedades de objetos en distintas variables. */
const {Router}= require('express');
/* Creación de un nuevo objeto de enrutador. */
const router = Router();

/* Importando las funciones desde el archivo index.controllers.js. */
const { getProducto }=require('../controllers/producto.controlles');
const { getProductoById }=require('../controllers/producto.controlles');
const { createProducto }=require('../controllers/producto.controlles');
const { updateProducto }=require('../controllers/producto.controlles');
const { deleteProducto }=require('../controllers/producto.controlles');

/* El código anterior crea un objeto de enrutador y luego usa el objeto de enrutador para crear rutas
para la API. */
router.get('/',getProducto);
router.get('/:id', getProductoById);
router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

/* Esta es una forma de exportar el objeto del enrutador para que pueda usarse en otros archivos. */
module.exports=router;