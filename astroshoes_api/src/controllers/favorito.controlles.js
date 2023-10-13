
//--------------------------------------------------------CONEXION A POSTGRES--------------------------------------------------------------///
const basesDatos = require('../../Database/database');

//----------------------------------------------------------FAVORITOS---------------------------------------------------------------///
//-------------------------------------------------------SELECCIONAR FAVORITOS------------------------------------------------------//
/**
 * Recibe un correo electrónico, busca la identificación del usuario y luego devuelve los productos
 * favoritos del usuario.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 * @returns los productos que el usuario ha marcado como favoritos.
 */
const listarFavoritos = async (req, res) => {

    try {
        const email = req.body.email;
        console.log(email);
        // Buscar id del usuario correspondiente al email recibido
        const usuario = await basesDatos.query('SELECT id_usuario FROM usuarios WHERE email = $1', [email]);
        const id_usuario = usuario.rows[0].id_usuario;

        console.log(id_usuario);

        // Consultar los productos favoritos del usuario
        const response = await basesDatos.query('SELECT * FROM favoritos WHERE id_usuario = $1', [id_usuario]);
        res.status(200).json({ success: true, data: response.rows });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lo sentimos!!! :'v "
        })
    }
};
//------------------------SELECCIONAR POR ID DE FAVORITOS----------------------------//
/**
 * Obtiene los favoritos de un usuario por su id
 * @param req - El objeto de la solicitud.
 * @param res - El objeto de respuesta.
 * @returns const getFavoritesById = async(req, res) => {
 *     intentar {
 *         const user_id = parseInt(req.params.id);
 *         const respuesta = espera basesDatos.query('SELECCIONE * DE favoritos DONDE fk_user_id = ',
 * [user_id]);
 *         para (
 */
const getFavoritosById = async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id);
        const response = await basesDatos.query('SELECT * FROM favoritos WHERE fk_id_usuario = $1', [id_usuario]);
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

/**
 * Consulta en la base de datos todas las filas de la tabla 'favoritos' y las devuelve en formato JSON
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const getFavoritos = async (req, res) => {
    try
    {
        const response = await basesDatos.query('select *from favoritos;');
        res.status(200).json(response.rows);

    } catch (error)
    {
        return res.status(500).json({
            message:"Lo sentimos!!! :'v "
        })
    }   
};

//----------------------------CREAR FAVORITOS----------------------------//
/**
 * Toma el correo electrónico y la identificación del producto del cuerpo de la solicitud, encuentra la
 * identificación de usuario correspondiente al correo electrónico, verifica si el producto ya está en
 * la lista de favoritos del usuario y, de no ser así, lo agrega a la lista de favoritos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const createFavorito = async (req, res) => {
    try {
        const email = req.body.email;
        const id_producto = req.body.id_producto;
        //console.log(email);
        // Buscar id del usuario correspondiente al email recibido
        const usuario = await basesDatos.query('SELECT id_usuario FROM usuarios WHERE email = $1', [email]);
        const id_usuario = usuario.rows[0].id_usuario;

        // Check si el producto ya esta en la tabla de fav
        const existingFavorites = await basesDatos.query('SELECT * FROM favoritos WHERE fk_id_producto = $1 AND fk_id_usuario = $2', [id_producto, id_usuario]);
        if (existingFavorites.rows.length > 0) {
            return res.status(400).json({
                message: 'Product ya esta en la lista de favoritos'
            });
        }

        // Insertar en la tabla "favoritos"
        const response = await basesDatos.query('INSERT INTO favoritos (fk_id_producto,fk_id_usuario) VALUES ($1, $2)', [id_producto, id_usuario]);

        res.json({
            message: 'Insertado con exito.',
            body: {
                favorito: { id_producto, email }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Ocurre un error."
        });
    }
};


//----------------------------MODIFICAR FAVORITOS----------------------------//
/**
 * Actualiza los datos de la tabla Favoritos en la base de datos
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const updateFavoritos = async (req, res) => {
    try {
        const pk_id_favorito = parseInt(req.params.id);
        const { fk_id_usuario, fk_id_producto } = req.body;

        const response = await basesDatos.query('UPDATE "Favoritos" SET fk_id_usuario=$1,fk_id_producto=$2 WHERE "pk_id_favorito" = $3;', [
            fk_id_usuario,
            fk_id_producto,
            pk_id_favorito
        ]);
        res.json('Categoria Updated Exitosa');

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};
//-------------------------------DELETE FAVORITOS------------------------------//
/**
 * Elimina un usuario de la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const deleteFavoritos = async (req, res) => {

    try {
        const pk_id_favorito = parseInt(req.params.id);
        await basesDatos.query('DELETE FROM favoritos where "id_favorito" = $1', [
            pk_id_favorito
        ]);
        res.json(`User ${pk_id_favorito} deleted Successfully`);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};


//----------------------------------------------------------COMUNICACION-------------------------------------------///
/* El código anterior está exportando las funciones que se van a utilizar en las rutas. */
module.exports = {
    listarFavoritos,
    getFavoritos,
    getFavoritosById,
    createFavorito,
    updateFavoritos,
    deleteFavoritos,
};