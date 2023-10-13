
//--------------------------------------------------------CONEXION A POSTGRES--------------------------------------------------------------///
const basesDatos = require('../../Database/database');

//-------------------------OBTENER NUMERO DE COMPROBANTES---------------------------//
/**
 * Consulta la base de datos para todos los usuarios y devuelve el resultado en formato JSON
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const getComprobantes = async (req, res) => {
    try {
        const response = await basesDatos.query('select *from "comprobante_venta";');
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!!"
        })
    }
};

// Comprobante venta
const crearComprobanteVentaConDetalle = async (req, res) => {
    try {
        const { email, total, carrito } = req.body;

        // Obtener el id_usuario correspondiente al email recibido
        const usuario = await basesDatos.query('SELECT id_usuario FROM usuarios WHERE email = $1', [email]);
        const fk_id_usuario = usuario.rows[0].id_usuario;
        // Iniciar una transacción
        await basesDatos.query('BEGIN');

        // Insertar el comprobante de venta en la tabla comprobante_venta
        const nuevoComprobante = await basesDatos.query(
            'INSERT INTO comprobante_venta (fk_id_usuario, fecha_venta, total) VALUES ($1, CURRENT_DATE, $2) RETURNING id_comprobante',
            [fk_id_usuario, total]
        );

        const idComprobante = nuevoComprobante.rows[0].id_comprobante;

        // Actualizar el estado de los productos en la tabla carrito a "comprado"
        for (const producto of carrito) {
            await basesDatos.query(
                'UPDATE carrito SET estado = $1 WHERE id_carrito = $2',
                ['comprado', producto.id_carrito]
            );
        }

        // Insertar los productos del carrito en la tabla detalle_comprobante
        for (const producto of carrito) {
            await basesDatos.query(
                'INSERT INTO detalle_comprobante (id_comprobante, fk_id_producto, cantidad, precio_unitario, nombre_producto, codigo_producto, modelo, genero, talla) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [idComprobante, producto.fk_id_producto, producto.cantidad, producto.producto.costo,producto.producto.nombre_producto,producto.producto.codigo_producto, producto.producto.modelo, producto.producto.genero, producto.producto.talla]
            );
        }

        // Confirmar la transacción
        await basesDatos.query('COMMIT');

        res.json({
            message: 'Comprobante de venta creado exitosamente',
            id_comprobante: idComprobante
        });
    } catch (error) {
        // Revertir la transacción en caso de error
        await basesDatos.query('ROLLBACK');

        return res.status(500).json({
            message: 'Error al crear el comprobante de venta',
            error: error.message
        });
    }
};


const listarComprobantesConDetalle = async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id);

        // Obtener los comprobantes de venta asociados al fk_id_usuario
        const comprobantes = await basesDatos.query(
            'SELECT * FROM comprobante_venta WHERE fk_id_usuario = $1',
            [id_usuario]
        );

        // Obtener los detalles de cada comprobante de venta
        for (const comprobante of comprobantes.rows) {
            const detalles = await basesDatos.query(
                `SELECT detalle.*
                FROM detalle_comprobante AS detalle
                WHERE detalle.id_comprobante = $1;`,
                [comprobante.id_comprobante]
            );

            comprobante.detalles = detalles.rows;
        }

        res.json({
            comprobantes: comprobantes.rows
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los comprobantes de venta con su detalle',
            error: error.message
        });
    }
};

//----------------------------------------------------------COMUNICACION-------------------------------------------///
/* El código anterior está exportando las funciones que se van a utilizar en las rutas. */
module.exports = {
    getComprobantes,
    crearComprobanteVentaConDetalle,
    listarComprobantesConDetalle 
};