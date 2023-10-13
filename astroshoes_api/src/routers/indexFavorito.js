/* Esta es una tarea de desestructuración. Es una expresión de JavaScript que hace posible descomprimir
valores de matrices o propiedades de objetos en distintas variables. */
const {Router}= require('express');
const router = Router();

/* Importando las funciones desde el archivo index.controllers.js. */
const { getFavoritos }=require('../controllers/favorito.controlles');
const { getFavoritosById }=require('../controllers/favorito.controlles');
const { createFavorito }=require('../controllers/favorito.controlles');
const { updateFavoritos}=require('../controllers/favorito.controlles');
const { deleteFavoritos}=require('../controllers/favorito.controlles');

/* El código anterior crea un objeto de enrutador y luego usa el objeto de enrutador para crear rutas
para la API. */
router.get('/',getFavoritos);
router.get('/:id', getFavoritosById);
router.post('/', createFavorito);
router.put('/:id', updateFavoritos);
router.delete('/:id', deleteFavoritos);

/* Exportando el objeto del enrutador. */
module.exports=router;