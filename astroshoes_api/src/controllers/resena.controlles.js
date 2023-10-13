
//--------------------------------------------------------CONEXION A POSTGRES--------------------------------------------------------------///
const basesDatos = require('../../Database/database');


const getResenaById = async (req, res) => {
    try {
        const id_resenas = parseInt(req.params.id);
        const response = await basesDatos.query('select *from "resenas" WHERE "id_resenas" = $1;', [id_resenas]);
        res.json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};


const getResenas = async (req, res) => {
    try {
        const response = await basesDatos.query('select *from "resenas";');
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!!"
        })
    }
};

const create_resenas = async (req, res) => {

    try {
        const { id_resenas,fk_id_usuario,nombre,estrellas,comentario } = req.body;
        const response = await basesDatos.query('insert into "resenas"(fk_id_usuario,nombre,estrellas,comentario)values ($1,$2,$3,$4);', [fk_id_usuario,nombre,estrellas,comentario]);
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                producto: {  id_resenas,fk_id_usuario,nombre,estrellas,comentario }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};

//----------------------------------------------------------COMUNICACION-------------------------------------------///
/* El código anterior está exportando las funciones que se van a utilizar en las rutas. */
module.exports = {
    getResenaById,
    getResenas,
    create_resenas
    
};