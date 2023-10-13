/* Esta es una tarea de desestructuración. Es una expresión de JavaScript que hace posible descomprimir
valores de matrices o propiedades de objetos en distintas variables. */
const {Router}= require('express');
const router = Router();

/* Importando las funciones desde el archivo index.controllers.js. */
const { getCarrito }=require('../controllers/carrito.controlles');
const { getCarritoById }=require('../controllers/carrito.controlles');
const { createCarrito }=require('../controllers/carrito.controlles');
const { updateCarritoCantidad}=require('../controllers/carrito.controlles');
const { deleteCarrito}=require('../controllers/carrito.controlles');

/* El código anterior crea un objeto de enrutador y luego usa el objeto de enrutador para crear rutas
para la API. */
router.get('/',getCarrito);
router.get('/:id', getCarritoById);
router.post('/', createCarrito);
router.put('/:id', updateCarritoCantidad);
router.delete('/:id', deleteCarrito);

/* Exportando el objeto del enrutador. */
module.exports=router;