<?php
/**
 * Este archivo gestiona las operaciones CRUD sobre la tabla "clientes" y su autenticación.
 * 
 * Requiere:
 * - Conexion.php: Clase para manejar la conexión a la base de datos.
 * - funciones.php: Funciones auxiliares.
 * - Firebase JWT para autenticación basada en tokens.
 */

require_once('../clases/Conexion.php');
require_once('../funciones/funciones.php');
require '../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$con = new Conexion();

/**
 * Maneja solicitudes GET para obtener el perfil del usuario autenticado.
 * 
 * Autorización:
 * - Requiere un token JWT válido en el encabezado Authorization.
 * 
 * Respuestas:
 * - 200 OK: Devuelve el perfil del usuario en formato JSON.
 * - 400 Bad Request: Falta el token de autorización.
 * - 401 Unauthorized: Token inválido.
 * - 404 Not Found: El usuario no fue encontrado.
 * - 500 Internal Server Error: Error en el servidor.
 */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $jwt = trim(trim($headers['Authorization'], "Bearer"));

        try {
            $payload = decodeJWT($jwt);
            $userId = $payload->id;

            $sql = "SELECT id_cliente, nombre, apellido1, 
            apellido2, nombre_usuario, tipo, email 
                    FROM clientes 
                    WHERE id_cliente = '$userId'";
            try {
                $result = $con->query($sql);
                if ($result && $result->num_rows > 0) {
                    $perfil = $result->fetch_assoc();
                    header("HTTP/1.1 200 OK");
                    echo json_encode($perfil);
                } else {
                    header("HTTP/1.1 404 Not Found");
                }
            } catch (mysqli_sql_exception $e) {
                header("HTTP/1.1 500 Internal Server Error");
            }
        } catch (Exception $e) {
            header("HTTP/1.1 401 Unauthorized");
        }
    } else {
        header("HTTP/1.1 400 Bad Request");
    }
    exit;
}

/**
 * Maneja solicitudes POST para autenticación y registro de usuarios.
 * 
 * Opciones de solicitud:
 * 1. Inicio de sesión:
 *    - Parámetros requeridos (POST):
 *        - usuario: puede ser el nombre o el email
 *        - contrasena
 *    - Devuelve un token JWT si las credenciales son válidas.
 * 
 * 2. Registro de usuario:
 *    - Parámetros requeridos (POST): nombre_usuario, email, contrasena.
 * 
 * Respuestas:
 * - 200 OK: Inicio de sesión exitoso, devuelve el token.
 * - 201 Created: Registro exitoso, devuelve el token.
 * - 400 Bad Request: Parámetros inválidos.
 * - 401 Unauthorized: Credenciales inválidas.
 * - 404 Not Found: Usuario no encontrado.
 * - 409 Conflict: Nombre de usuario o correo electrónico ya en uso.
 * - 500 Internal Server Error: Error en el servidor.
 */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['usuario']) && isset($_POST['contrasena'])) {
        $usuario = $_POST['usuario'];
        $contrasena = $_POST['contrasena'];

        $sql = "SELECT id_cliente, nombre_usuario, contrasena, tipo FROM clientes 
        WHERE nombre_usuario='$usuario' OR email='$usuario'";
        
        try {
            $result = $con->query($sql);
            if ($result and $result->num_rows > 0) {
                $cliente = $result->fetch_assoc();
                if (hash('sha512', $contrasena) === $cliente['contrasena']) {
                    $token = generateJWT($cliente['id_cliente'], $cliente['nombre_usuario'], $cliente['tipo']);
                    header("HTTP/1.1 200 OK");
                    echo json_encode(array(
                        "token" => $token,
                        "usuario" => $cliente['nombre_usuario'],
                        "tipo" => $cliente['tipo'],
                    ));
                } else {
                    header("HTTP/1.1 401 Unauthorized");
                }
            } else {
                header("HTTP/1.1 404 Not Found");
            }
        } catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
        }
    } elseif (isset($_POST['nombre']) && isset($_POST['apellido1']) && isset($_POST['nombre_usuario']) 
        && isset($_POST['email']) && isset($_POST['contrasena'])) {
        $nombre = $_POST['nombre'];
        $apellido1 = $_POST['apellido1'];
        $apellido2 = null; // Inicializa como null
        // Si se recibe 'apellido2' y no está vacío, asignamos su valor
        if (isset($_POST['apellido2']) && !empty($_POST['apellido2'])) {
            $apellido2 = $_POST['apellido2'];
        }
        $nombre_usuario = $_POST['nombre_usuario'];
        $email = $_POST['email'];
        $contrasena = $_POST['contrasena'];

        try {
            $sql_check_nombre = "SELECT id_cliente FROM clientes WHERE nombre_usuario='$nombre_usuario'";
            $result_check_nombre = $con->query($sql_check_nombre);

            $sql_check_email = "SELECT id_cliente FROM clientes WHERE email='$email'";
            $result_check_email = $con->query($sql_check_email);
            
            if ($result_check_nombre and $result_check_nombre->num_rows > 0) {
                header("HTTP/1.1 409 Conflict");
                echo json_encode(["error" => "Nombre de usuario ya en uso"]);

            } else if ($result_check_email and $result_check_email->num_rows > 0) {
                header("HTTP/1.1 409 Conflict");
                echo json_encode(["error" => "Email ya en uso"]);
            }else {
                $hash_contrasena = hash('sha512', $contrasena);

                $columns = ['nombre', 'apellido1', 'nombre_usuario', 'email', 'contrasena', 'tipo'];
                $values = ["'$nombre'", "'$apellido1'", "'$nombre_usuario'", "'$email'", "'$hash_contrasena'", "'user'"];

                if ($apellido2 !== null) {
                    // Solo añadimos el campo apellido2 si no es null
                    $columns[] = 'apellido2';
                    $values[] = "'$apellido2'"; // Añadimos su valor
                }

                // Crear la consulta SQL con las columnas y valores dinámicamente
                $sql_insert = "INSERT INTO clientes (" . implode(", ", $columns) . ") 
                            VALUES (" . implode(", ", $values) . ")";

                try {
                    $con->query($sql_insert);
                    if ($con->affected_rows > 0) {
                        $sql_get_user = "SELECT id_cliente, nombre_usuario, tipo FROM clientes WHERE nombre_usuario='$nombre_usuario' AND email='$email'";
                        $result_user = $con->query($sql_get_user);
                        $new_user = $result_user->fetch_assoc();
                        $token = generateJWT($new_user['id_cliente'], $new_user['nombre_usuario'], $new_user['tipo']);
                        header("HTTP/1.1 201 Created");
                        echo json_encode(array(
                            "token" => $token,
                            "usuario" => $new_user['nombre_usuario'],
                            "tipo" => $new_user['tipo'],
                        ));
                    } else {
                        header("HTTP/1.1 500 Internal Server Error");
                    } 
                } catch (mysqli_sql_exception $e) {
                    header("HTTP/1.1 500 Internal Server Error");
                }
            }
        } catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
        }
    }else {
        header("HTTP/1.1 400 Bad Request");
    }
    exit;
}

header("HTTP/1.1 400 Bad Request");
?>