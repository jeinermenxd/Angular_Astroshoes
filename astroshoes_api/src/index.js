
/* Importación del módulo express. */
const express = require('express');
/* Un middleware que nos permite realizar peticiones desde el frontend al backend. */
const cors = require('cors');
/* Creación de una instancia de la aplicación express. */
const app = express();

// Politcas CORS
app.use(cors());


//añadir nombre del puerto en este caso es el Fly ----- o el localthost
require('dotenv').config();

/* Obtener el puerto de la variable de entorno. */
const port = process.env.PORT;

//middlewars
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const cookieParser = require('cookie-parser');

//cors
app.use(cors({
    origin: true,
    methods: ['GET', 'POST']
}));


//router//
/* Importando los enrutadores del archivo index.js en la carpeta de enrutadores. */
app.use('/producto', require('./routers/indexProducto'));
app.use('/marca', require('./routers/indexMarcas'));
app.use('/categoria', require('./routers/indexCategoria'));
app.use('/usuario', require('./routers/indexUsuario'));
app.use('/carrito', require('./routers/indexCarrito'));
app.use('/comprobante', require('./routers/indexComprobante'));
app.use('/favoritos', require('./routers/indexFavorito'));
app.use('/pdf', require('./routers/indexPDF'));
app.use('/productos/filtrar', require('./routers/indexFilter'));
app.use('/resenas', require('./routers/indexResenas'));
app.use('/acceso', require('./routers/indexLogin'));


/* Escuchando el puerto e imprimiendo un mensaje a la consola. */
app.listen(port);
console.log('INICIO DE SERVER EXITOSO', port, '!!');