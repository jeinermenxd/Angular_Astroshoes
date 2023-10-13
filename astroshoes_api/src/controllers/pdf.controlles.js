
//--------------------------------------------------------CONEXION A POSTGRES--------------------------------------------------------------///
const basesDatos = require('../../Database/database');


//---------------------------LISTAR PDF----------------------------------------------------------//
const getPDF = async (req, res) => {
    try {
        const response = await basesDatos.query('SELECT * FROM "pdf" ORDER BY id_pdf ASC;');
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};

//---------------------------Insertar DE PDF----------------------------------------------------------//

const create_pdf = async (req, res) => {

    try {
        const {  id_pdf, version_pdf, enlace_pdf, descripcion } = req.body;
        const response = await basesDatos.query('insert into "pdf"( id_pdf, version_pdf, enlace_pdf, descripcion)values ($1,$2,$3,$4);', [ id_pdf, version_pdf, enlace_pdf, descripcion]);
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                producto: {  id_pdf, version_pdf, enlace_pdf, descripcion }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};

//--------------------------MODIFICAR PDF-------------------------------------------------------//

/**
 * Actualiza un producto en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const updatePDF = async (req, res) => {

    try {
        const id_pdf = parseInt(req.params.id);
        const { version_pdf, enlace_pdf, descripcion } = req.body;

        const response = await basesDatos.query(
            'UPDATE "pdf" SET version_pdf=$1, enlace_pdf=$2, descripcion=$3 WHERE "id_pdf" =$4',
            [version_pdf, enlace_pdf, descripcion, id_pdf
        ]);
        res.json('User Updated Successfully');

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};

//-------------------------------DELETE PDF------------------------------//
/**
 * Elimina un producto de la base de datos.
 * @param req - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la cadena
 * de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param res - El objeto de respuesta.
 */
const delete_pdf = async (req, res) => {

    try {
        const id_pdf = parseInt(req.params.id);
        await basesDatos.query('DELETE FROM "pdf" where id_pdf = $1', [
            id_pdf
        ]);
        res.json(`User ${id_pdf} deleted Successfully`);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};

/////// GETID///////////
const getPDFById = async (req, res) => {
    try {
        const id_pdf = parseInt(req.params.id);
        const response = await basesDatos.query('select *from "pdf" WHERE "id_pdf" = $1', [id_pdf]);
        res.json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};



//----------------------------------------------------------COMUNICACION-------------------------------------------///
/* El código anterior está exportando las funciones que se van a utilizar en las rutas. */
module.exports = {
    getPDF,
    create_pdf,
    updatePDF,
    delete_pdf,
    getPDFById,
};