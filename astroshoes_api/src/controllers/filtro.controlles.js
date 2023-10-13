
//--------------------------------------------------------CONEXION A POSTGRES--------------------------------------------------------------///
const basesDatos = require('../../Database/database');




const filtro = async (req, res) => {
    try {
        const { talla ,fk_marca,  costo, color, genero } = req.body;
        const response = await basesDatos.query('SELECT * FROM filtrar_productos($1, $2, $3, $4, $5);', [talla ,fk_marca,  costo, color, genero]);
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
    filtro,
    
};