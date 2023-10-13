/* Esta es una tarea de desestructuración. Es una expresión de JavaScript que hace posible descomprimir
valores de matrices o propiedades de objetos en distintas variables. */
const {Router}= require('express');
const router = Router();

/* Importando las funciones desde el archivo index.controllers.js. */
const { getPDF }=require('../controllers/pdf.controlles');
const { create_pdf }=require('../controllers/pdf.controlles');
const { updatePDF }=require('../controllers/pdf.controlles');
const { delete_pdf }=require('../controllers/pdf.controlles');
const { getPDFById }=require('../controllers/pdf.controlles');

/* El código anterior crea un objeto de enrutador y luego usa el objeto de enrutador para crear rutas
para la API. */
router.get('/',getPDF);
router.post('/', create_pdf);
router.put('/:id', updatePDF)
router.delete('/:id', delete_pdf);
router.get('/:id', getPDFById);


/* Esta es una sintaxis de Node.js que hace que el objeto del enrutador en el archivo sea accesible
para otros archivos. */
module.exports=router;