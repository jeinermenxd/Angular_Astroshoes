/* Esta es una tarea de desestructuración. Es una expresión de JavaScript que hace posible descomprimir
valores de matrices o propiedades de objetos en distintas variables. */
const {Router}= require('express');
const router = Router();

/* Importando las funciones desde el archivo index.controllers.js. */
const { getComprobantes }=require('../controllers/comprobante.controlles');
const { crearComprobanteVentaConDetalle }=require('../controllers/comprobante.controlles');
const { listarComprobantesConDetalle }=require('../controllers/comprobante.controlles');

/* El código anterior crea un objeto de enrutador y luego usa el objeto de enrutador para crear rutas
para la API. */
router.post('/',crearComprobanteVentaConDetalle);
router.get('/', getComprobantes);
router.get('/:id', listarComprobantesConDetalle);

/* Exportando el objeto del enrutador. */
module.exports=router;