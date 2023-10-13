//--------------------------------------------------------CONEXION A POSTGRES--------------------------------------------------------------///
const basesDatos = require('../../Database/database');
//-----------------------------------------------------------SENTENCIAS DE TABLA PRODUCTOS-------------------------------------------------///

/* El código anterior requiere el módulo jsonwebtoken. */
const jwt = require('jsonwebtoken');
const fs = require('fs');
// Leer llave privada
const privateKey = fs.readFileSync('./private.pem', 'utf8');

// Verificar token
/**
 * Comprueba si hay un token en las cookies, si lo hay, lo verifica y agrega el usuario decodificado a
 * la solicitud.
 * @param req - El objeto de la solicitud.
 * @param res - El objeto de respuesta.
 * @param next - Esta es una función de devolución de llamada que se llamará cuando se complete el
 * middleware.
 * @returns Una función que verifica el token.
 */
const verifyToken = (req, res, next) => {
    // Obtener token de las cookies
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }

    // Verificar token
    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        // Agregar usuario decodificado al request
        req.user = decoded.user;
        next();
    });
};


/**
 * Toma los datos del usuario del cuerpo de la solicitud, verifica si el correo electrónico ya está en
 * uso y, si no lo está, crea un nuevo usuario en la base de datos y devuelve un token.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const setRegister = (req, res) => {
    const { nombres, apellidos, email, password } = req.body;

    // primero verifica si el email ya esta en uso
    basesDatos.query('SELECT email FROM usuarios WHERE email = $1', [email], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rowCount > 0) {
            res.status(400).json({ message: 'Email ya en uso' });
        } else {
            basesDatos.query('INSERT INTO usuarios (nombres, apellidos, email, password, created_at, rol, status) VALUES ($1, $2, $3, $4, NOW(), $5, $6)', [nombres, apellidos, email, password, 'user', 'active'], (error, results) => {
                if (error) {
                    throw error;
                }
                const user = {
                    id_usuario: results.insertId,
                    nombres: nombres,
                    apellidos: apellidos,
                    email: email,
                    rol: 'user',
                    status: 'active'
                }
                // Crear token
                const token = jwt.sign({ user }, privateKey);
                res.status(201).json({ token });
            });
        }
    });
}



/**
 * Recibe un correo electrónico y una contraseña del cuerpo de la solicitud, luego consulta la base de
 * datos para encontrar al usuario con ese correo electrónico, si existe, compara la contraseña con la
 * de la base de datos, si coinciden, crea un token con el usuario. id, correo electrónico y rol, y lo
 * envía de vuelta al cliente
 * @param req - El objeto de la solicitud.
 * @param res - El objeto de respuesta.
 */
const setLogin = (req, res) => {
    const { email, password } = req.body;
    basesDatos.query('SELECT * FROM usuarios WHERE email = $1', [email], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows.length > 0) {
            if (results.rows[0].password === password) {
                // Obtener el id, email y rol del usuario
                const user = {
                    id: results.rows[0].id_usuario,
                    email: results.rows[0].email,
                    nombres: results.rows[0].nombres,
                    rol: results.rows[0].rol
                }
                // Crear token
                const token = jwt.sign({ user }, privateKey, { expiresIn: '1h' });

                res.status(200).json({ token });
            } else {
                res.status(401).json({ message: 'Contraseña incorrecta' });
            }
        } else {
            res.status(404).json({ message: 'Email no encontrado' });
        }
    });
}




//----------------------------------------------------------COMUNICACION-------------------------------------------///
/* El código anterior está exportando las funciones que se van a utilizar en las rutas. */
module.exports = {
    verifyToken,
    setRegister,
    setLogin,
   
};