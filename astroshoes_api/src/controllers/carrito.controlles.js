
//--------------------------------------------------------CONEXION A POSTGRES--------------------------------------------------------------///
const basesDatos = require('../../Database/database');


const getCarritoById = async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id);
        const response = await basesDatos.query('SELECT * FROM carrito WHERE fk_id_usuario = $1 AND estado = $2', [id_usuario, 'pendiente']);
        for (let i = 0; i < response.rows.length; i++) {
            const producto = await basesDatos.query('SELECT * FROM "Producto" WHERE pk_id_producto = $1', [response.rows[i].fk_id_producto]);
            response.rows[i].producto = producto.rows[0];
        }
        res.status(200).json({ success: true, data: response.rows });
    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};

const getCarrito = async (req, res) => {
    try {
        const response = await basesDatos.query('SELECT * FROM carrito WHERE estado = $1', ['pendiente']);
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};

const createCarrito = async (req, res) => {
    try {
        const email = req.body.email;
        const id_producto = req.body.id_producto;

        // Obtener el id_usuario correspondiente al email recibido
        const usuario = await basesDatos.query('SELECT id_usuario FROM usuarios WHERE email = $1', [email]);
        const id_usuario = usuario.rows[0].id_usuario;

        // Verificar si el producto ya está en la tabla de carrito
        const existingCarrito = await basesDatos.query('SELECT * FROM carrito WHERE fk_id_producto = $1 AND fk_id_usuario = $2 AND estado = $3', [id_producto, id_usuario, 'pendiente']);
        if (existingCarrito.rows.length > 0) {
            return res.status(400).json({
                message: 'El producto ya está en el carrito'
            });
        }

        // Insertar en la tabla "carrito"
        const response = await basesDatos.query('INSERT INTO carrito (fk_id_usuario, fk_id_producto, cantidad, estado) VALUES ($1, $2, $3, $4)', [id_usuario, id_producto, 1, 'pendiente']);

        res.json({
            message: 'Producto agregado al carrito con éxito.',
            body: {
                carrito: { id_producto, email }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Ha ocurrido un error."
        });
    }
};

const updateCarritoCantidad = async (req, res) => {
    try {
        const id_carrito = req.body.id_carrito;
        const cantidad = req.body.cantidad;
        // Verificar si el registro existe en el carrito
        const existingCarrito = await basesDatos.query('SELECT * FROM carrito WHERE id_carrito = $1', [id_carrito]);
        if (existingCarrito.rows.length === 0) {
            return res.status(404).json({
                message: 'El registro del carrito no existe'
            });
        }

        // Actualizar la cantidad del producto en el carrito
        await basesDatos.query('UPDATE carrito SET cantidad = $1 WHERE id_carrito = $2', [cantidad, id_carrito]);

        res.json({
            message: 'La cantidad del producto en el carrito se ha actualizado con éxito.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Ha ocurrido un error al actualizar la cantidad en el carrito.'
        });
    }
};

const deleteCarrito = async (req, res) => {
    try {
        const id_carrito = req.params.id;
        // Verificar si el registro existe en el carrito
        const existingCarrito = await basesDatos.query('SELECT * FROM carrito WHERE id_carrito = $1', [id_carrito]);
        if (existingCarrito.rows.length === 0) {
            return res.status(404).json({
                message: 'El registro del carrito no existe'
            });
        }

        // Eliminar el registro del carrito
        await basesDatos.query('DELETE FROM carrito WHERE id_carrito = $1', [id_carrito]);

        res.json({
            message: 'El registro del carrito se ha eliminado con éxito.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Ha ocurrido un error al eliminar el registro del carrito.'
        });
    }
};


//----------------------------------------------------------COMUNICACION-------------------------------------------///
/* El código anterior está exportando las funciones que se van a utilizar en las rutas. */
module.exports = {
    getCarrito,
    getCarritoById,
    createCarrito,
    updateCarritoCantidad,
    deleteCarrito,
};