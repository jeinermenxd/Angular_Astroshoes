//--------------------------------------------------------CONEXION A POSTGRES--------------------------------------------------------------///
const basesDatos = require('../../Database/database');


//----------------------------------------------------------USUARIO---------------------------------------------------------------///
//-------------------------SELECCIONAR USUARIO----------------------------//
/**
 * Consulta la base de datos para todos los usuarios y devuelve el resultado en formato JSON
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const getUsuario = async (req, res) => {
    try {
        const response = await basesDatos.query('select *from "usuarios";');
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};

//------------------------SELECCIONAR POR ID DE USUARIO----------------------------//
/**
 * Es una función que recibe una petición y una respuesta, y devuelve un JSON con los datos del usuario
 * @param req - El objeto de la solicitud.
 * @param res - El objeto de respuesta.
 * @returns el usuario con el id que se está pasando como parámetro.
 */
const getUsuarioById = async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id);
        const response = await basesDatos.query('select *from "usuarios" WHERE "id_usuario" = $1;', [id_usuario]);
        res.json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------CREAR UASUARIOS----------------------------//
/**
 * Crea un nuevo usuario en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const createUsuario = async (req, res) => {
    try {
        const { id_usuario, nombre, apellido, correo, contrasena } = req.body;
        const response = await basesDatos.query('INSERT INTO "usuarios" ("id_usuario","nombre","apellido","correo", "contrasena") VALUES ($1, $2, $3,$4,$5);', [id_usuario, nombre, apellido, correo, contrasena]);
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                producto: { id_usuario, nombre, apellido, correo, contrasena }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------MODIFICAR USUARIOS----------------------------//
/**
 * Toma la identificación del usuario para actualizarse, y los nuevos datos para actualizarse, y
 * actualiza al usuario en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const updateUsuario = async (req, res) => {
    try {
      const id_usuario = parseInt(req.params.id);
      const usuario = req.body[0]; // Accedemos al primer elemento del array (el objeto del usuario) 
      const { nombres, apellidos, email, password, created_at, updated_at, rol, status } = usuario; // Desestructuramos las propiedades del objeto
  
      const response = await basesDatos.query(
        'UPDATE "usuarios" SET "nombres" = $1, "apellidos" = $2, "email" = $3, "password" = $4, "created_at" = $5, "updated_at" = $6, "rol" = $7, "status" = $8 WHERE "id_usuario" = $9;',
        [nombres, apellidos, email, password, created_at, updated_at, rol, status, id_usuario]
      );
  
      res.json('Usuario Updated Exitosa');
    } catch (error) {
      return res.status(500).json({
        message: "Lo sentimos!!! :'v "
      });
    }
  };
//-------------------------------DELETE USUARIOS------------------------------//
/**
 * Elimina un usuario de la base de datos.
 * @param req - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la cadena
 * de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param res - El objeto de respuesta.
 */
const deleteUsuario = async (req, res) => {

    try {
        const id_usuario = parseInt(req.params.id);
        await basesDatos.query('SELECT eliminar_usuario($1);', [
            id_usuario
        ]);
        res.json(`User ${id_usuario} deleted Successfully`);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};

//----------------------------------------------------------COMUNICACION-------------------------------------------///
/* El código anterior está exportando las funciones que se van a utilizar en las rutas. */
module.exports = {
    getUsuario,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario, 
};