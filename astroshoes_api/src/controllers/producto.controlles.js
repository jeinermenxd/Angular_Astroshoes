//--------------------------------------------------------CONEXION A POSTGRES--------------------------------------------------------------///
const basesDatos = require('../../Database/database');



//-------------------------SELECCIONAR PROUCTO----------------------------//
/**
 * Obtiene todos los productos de la base de datos y los devuelve en formato JSON
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const getProducto = async (req, res) => {
    try {
        const response = await basesDatos.query('SELECT * FROM "Producto" ORDER BY pk_id_producto ASC;');
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};
//------------------------SELECCIONAR POR ID DE PROUCTO----------------------------//
/**
 * Es una función que recibe una solicitud y una respuesta, y devuelve un JSON con el producto que
 * coincide con la identificación que se envió en la solicitud.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 * @returns El producto con el id que se pasa como parámetro.
 */
const getProductoById = async (req, res) => {

    try {
        const pk_id_producto = parseInt(req.params.id);
        const response = await basesDatos.query('SELECT * FROM "Producto" WHERE "pk_id_producto" = $1', [pk_id_producto]);
        res.json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------CREAR PROUCTO----------------------------//
/**
 * Crea un nuevo producto en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const createProducto = async (req, res) => {

    try {
        const { pk_id_producto, codigo_producto, img, nombre_producto, descripcion, fk_marca, modelo, genero, talla, costo, oferta, fk_id_categoria, color,estado } = req.body;
        const response = await basesDatos.query('insert into "Producto"(pk_id_producto,codigo_producto,img,nombre_producto,descripcion,fk_marca,modelo, genero, talla, costo,oferta, fk_id_categoria,color,estado)values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14);', [pk_id_producto, codigo_producto, img, nombre_producto, descripcion, fk_marca, modelo, genero, talla, costo, oferta, fk_id_categoria,color,estado]);
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                producto: { pk_id_producto, codigo_producto, img, nombre_producto, descripcion, fk_marca, modelo, genero, talla, costo, oferta, fk_id_categoria,color,estado }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------MODIFICAR PROUCTO----------------------------//
/**
 * Actualiza un producto en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const updateProducto = async (req, res) => {

    try {
        const pk_id_producto = parseInt(req.params.id);
        const { codigo_producto, img, nombre_producto, descripcion, fk_marca, modelo, genero, talla, costo, oferta, fk_id_categoria,color,estado } = req.body;

        const response = await basesDatos.query('UPDATE "Producto" SET codigo_producto=$1,img=$2,nombre_producto=$3,descripcion=$4,fk_marca=$5,modelo=$6, genero=$7, talla=$8, costo=$9,oferta=$10,fk_id_categoria=$11, color=$12,estado=$13 WHERE "pk_id_producto" =$14', [
            codigo_producto,
            img, nombre_producto,
            descripcion,
            fk_marca,
            modelo,
            genero,
            talla,
            costo,
            oferta,
            fk_id_categoria,
            color,
            estado,
            pk_id_producto
        ]);
        res.json('User Updated Successfully');

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};
//-------------------------------DELETE PROUCTO------------------------------//
/**
 * Elimina un producto de la base de datos.
 * @param req - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la cadena
 * de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param res - El objeto de respuesta.
 */
const deleteProducto = async (req, res) => {

    try {
        const pk_id_producto = parseInt(req.params.id);
        await basesDatos.query('SELECT eliminar_producto($1);', [
            pk_id_producto
        ]);
        res.json(`User ${pk_id_producto} deleted Successfully`);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};

//----------------------------------------------------------COMUNICACION-------------------------------------------///
/* El código anterior está exportando las funciones que se van a utilizar en las rutas. */
module.exports = {
    getProducto,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto, 
};