
//--------------------------------------------------------CONEXION A POSTGRES--------------------------------------------------------------///
const basesDatos = require('../../Database/database');


//------------------------------------------------------------SENTENCIAS DE TABLA CATEGORIAS-------------------------------------------------///
//-------------------------SELECCIONAR CATEGORIA----------------------------//
/**
 * Consulta la base de datos para todas las categorías y las devuelve en formato JSON.
 * @param req - El objeto de la solicitud.
 * @param res - El objeto de respuesta.
 * @returns la lista de categorías.
 */
const getCategoria = async (req, res) => {
    try {
        const response = await basesDatos.query('SELECT * FROM "Categoria" ORDER BY "pk_id_categoria" ASC;');
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//------------------------SELECCIONAR POR NOMBRE DE CATEGORIA----------------------------//
/**
 * Es una función que recibe una solicitud y una respuesta, y devuelve un JSON con los datos de la
 * categoría que coinciden con el id que se envió en la solicitud
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 * @returns la categoría por id.
 */
const getCategoriaById = async (req, res) => {
    try {
        const pk_id_categoria = parseInt(req.params.id);
        const response = await basesDatos.query('select *from "Categoria" WHERE "pk_id_categoria" = $1;', [pk_id_categoria]);
        res.json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------CREAR CATEGORIAS----------------------------//
/**
 * Crea una nueva categoría en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const createCategoria = async (req, res) => {
    try {
        const { pk_id_categoria, nombre_cat,  descripcion } = req.body;
        const response = await basesDatos.query('INSERT INTO "Categoria" ("pk_id_categoria","nombre_cat","descripcion") VALUES ($1, $2, $3);', [pk_id_categoria, nombre_cat,  descripcion]);
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                producto: { pk_id_categoria, nombre_cat,  descripcion }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------MODIFICAR CATEGORIAS----------------------------//
/**
 * Actualiza una categoría en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const updateCategoria = async (req, res) => {
    try {
        const pk_id_categoria = parseInt(req.params.id);
        const { nombre_cat, descripcion } = req.body;

        const response = await basesDatos.query('UPDATE "Categoria" SET "nombre_cat"= $1 ,"descripcion" = $2  WHERE "pk_id_categoria" = $3;', [
            nombre_cat,
            descripcion,
            pk_id_categoria
        ]);
        res.json('Categoria Updated Exitosa');

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};
//-------------------------------DELETE CATEGORIAS------------------------------//
/**
 * Elimina una categoría de la base de datos.
 * @param req - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la cadena
 * de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param res - El objeto de respuesta.
 */
const deleteCategoria = async (req, res) => {

    try {
        const pk_id_categoria = parseInt(req.params.id);
        await basesDatos.query('SELECT eliminar_categoria($1);', [
            pk_id_categoria
        ]);
        res.json(`User ${pk_id_categoria} deleted Successfully`);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};

//----------------------------------------------------------COMUNICACION-------------------------------------------///
/* El código anterior está exportando las funciones que se van a utilizar en las rutas. */
module.exports = {
    getCategoria,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria, 
};