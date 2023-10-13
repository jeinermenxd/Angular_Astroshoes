/* Esta es una tarea de desestructuración. Es una expresión de JavaScript que hace posible descomprimir
valores de matrices o propiedades de objetos en distintas variables. */
const {Router}= require('express');
const router = Router();

/* Importando las funciones desde el archivo index.controllers.js. */
const { getMarcas }=require('../controllers/marca.controlles');
const { getMarcasById }=require('../controllers/marca.controlles');
const { createMarca}=require('../controllers/marca.controlles');
const { updateMarca }=require('../controllers/marca.controlles');
const { deleteMarca}=require('../controllers/marca.controlles');


/* El código anterior crea un objeto de enrutador y luego usa el objeto de enrutador para crear rutas
para la API. */
router.get('/',getMarcas);
router.get('/:id', getMarcasById);
router.post('/', createMarca);
router.put('/:id', updateMarca);
router.delete('/:id', deleteMarca);

/* Esta es una forma de exportar el objeto del enrutador para que pueda usarse en otros archivos. */
module.exports=router;