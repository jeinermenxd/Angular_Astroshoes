//--------------------------------------------------------CONEXION A POSTGRES--------------------------------------------------------------///
const basesDatos = require('../../Database/database');

//-----------------------------------------------------------SENTENCIAS DE TABLA MARCAS-------------------------------------------------///
//-------------------------SELECCIONAR MARCAS----------------------------//
/**
 * Es una función que devuelve una promesa que se resuelve en una matriz de objetos.
 * @param req - El objeto de la solicitud.
 * @param res - El objeto de respuesta.
 * @returns la lista de marcas en la base de datos.
 */
const getMarcas = async (req, res) => {

    try {
        const response = await basesDatos.query('SELECT * FROM "Marca" ORDER BY "id_Marca" ASC;');
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};
//------------------------SELECCIONAR POR ID DE MARCAS----------------------------//
/**
 * Es una función que recibe una solicitud y una respuesta, y devuelve los datos de una marca con el id
 * que se envía en la solicitud
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const getMarcasById = async (req, res) => {
    try {
        const id_Marca = parseInt(req.params.id);
        const response = await basesDatos.query('select *from "Marca" WHERE "id_Marca" = $1', [id_Marca]);
        res.json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------CREAR MARCAS----------------------------//
/**
 * Crea un nuevo Marca en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 * @returns const getMarca = asíncrono (req, res) => {
 *     intentar {
 *         const respuesta = espera basesDatos.query('SELECT * FROM "Marca";');
 *         res.json(respuesta.filas);
 *     } atrapar (error) {
 *         devuelve res.status(500).json({
 *             mensaje: "Lo sentimos!!! :'v "
 */
const createMarca = async (req, res) => {
    try {
        const { id_Marca, nombre, descripcion } = req.body;
        const response = await basesDatos.query('INSERT INTO "Marca" ("id_Marca","nombre","descripcion") VALUES($1, $2, $3);', [id_Marca, nombre, descripcion]);
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                producto: { id_Marca, nombre, descripcion }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------MODIFICAR MARCAS----------------------------//
/**
 * Actualiza una marca en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const updateMarca = async (req, res) => {
    try {
        const id_Marca = parseInt(req.params.id);
        const { nombre, descripcion } = req.body;

        const response = await basesDatos.query('UPDATE "Marca" SET "nombre"=$1 ,"descripcion" = $2 WHERE "id_Marca" = $3 ;', [
            nombre,
            descripcion,
            id_Marca
        ]);
        res.json('Marca Updated Exitosa');

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};
//-------------------------------DELETE MARCAS------------------------------//
/**
 * Elimina una marca de la base de datos.
 * @param req - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la cadena
 * de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param res - El objeto de respuesta.
 */
const deleteMarca = async (req, res) => {

    try {
        const id_Marca = parseInt(req.params.id);
        await basesDatos.query('SELECT eliminar_marca($1);', [
            id_Marca
        ]);
        res.json(`User ${id_Marca} deleted Successfully`);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};

//----------------------------------------------------------COMUNICACION-------------------------------------------///
/* El código anterior está exportando las funciones que se van a utilizar en las rutas. */
module.exports = {
    getMarcas,
    getMarcasById,
    createMarca,
    updateMarca,
    deleteMarca, 
};