<?php
/**
 * Este archivo gestiona las operaciones CRUD sobre la tabla "bares".
 * 
 * Requiere:
 * - Conexion.php: Clase para manejar la conexión a la base de datos.
 * - funciones.php: Funciones auxiliares.
 * - Firebase JWT para autenticación de tokens.
 */

require_once('../clases/Conexion.php');
require_once('../funciones/funciones.php');
require '../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$con = new Conexion();

/**
 * Maneja solicitudes GET para obtener información sobre los bares.
 * 
 * Parámetros opcionales (GET):
 * - id: ID del bar.
 * - nombre: Nombre del bar.
 * - direccion: Dirección del bar.
 * - hora_apertura: Hora de apertura.
 * - hora_cierre: Hora de cierre.
 * 
 * Respuestas:
 * - 200 OK: Devuelve los bares encontrados en formato JSON.
 * - 400 Bad Request: Error en los parámetros.
 * - 404 Not Found: No se encontraron bares.
 * - 500 Internal Server Error: Error en el servidor.
 */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM bares WHERE 1 ";
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $sql .= "AND id_bar='$id'";
    } elseif (isset($_GET['nombre']) || isset($_GET['direccion']) 
            || isset($_GET['hora_apertura']) || isset($_GET['hora_cierre'])) {
        if (isset($_GET['nombre'])) {
            $nombre = $_GET['nombre'];
            $sql .= "AND nombre LIKE '%$nombre%' ";
        }

        if (isset($_GET['direccion'])) {
            $direccion = $_GET['direccion'];
            $sql .= "AND direccion LIKE '%$direccion%' ";
        }

        if (isset($_GET['hora_apertura'])) {
            $hora_apertura = $_GET['hora_apertura'];
            $sql .= "AND hora_apertura >= '$hora_apertura' ";
        }

        if (isset($_GET['hora_cierre'])) {
            $hora_cierre = $_GET['hora_cierre'];
            $sql .= "AND hora_cierre <= '$hora_cierre' ";
        }
    }
    try {
        $result = $con->query($sql);
        if ($result && $result->num_rows > 0) {
            $bares = $result->fetch_all(MYSQLI_ASSOC);
            header("HTTP/1.1 200 OK");
            echo json_encode($bares);
        } else {
            header("HTTP/1.1 404 Not Found");
        }
    } catch (mysqli_sql_exception $e) {
        header("HTTP/1.1 500 Internal Server Error");
    }
    exit;
}

/**
 * Maneja solicitudes POST para crear un nuevo bar.
 * 
 * Parámetros requeridos (POST):
 * - nombre, direccion, telefono, latitud, longitud, hora_apertura, hora_cierre.
 * 
 * Autorización:
 * - Requiere token JWT válido con tipo "admin".
 * 
 * Respuestas:
 * - 201 Created: Bar creado con éxito, devuelve el ID.
 * - 400 Bad Request: Error en los parámetros.
 * - 401 Unauthorized: Usuario no autorizado.
 * - 500 Internal Server Error: Error en el servidor.
 */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $jwt = trim(trim($headers['Authorization'], "Bearer"));
        try {
            $payload = decodeJWT($jwt);
            $tipo = $payload->tipo;
            if ($tipo === "admin") {
                if (isset($_POST['nombre']) && isset($_POST['direccion'])
                    && isset($_POST['telefono']) && isset($_POST['hora_apertura'])
                    && isset($_POST['hora_cierre'])) {
                    $nombre = $_POST['nombre'];
                    $direccion = $_POST['direccion'];
                    $telefono = $_POST['telefono'];
                    $hora_apertura = $_POST['hora_apertura'];
                    $hora_cierre = $_POST['hora_cierre'];

                    $sql = "INSERT INTO bares (nombre, direccion, telefono, hora_apertura, hora_cierre) 
                            VALUES ('$nombre', '$direccion', '$telefono', '$hora_apertura', '$hora_cierre')";
                    try {
                        $con->query($sql);
                        if ($con->affected_rows > 0) {
                            header("HTTP/1.1 201 Created");
                            echo json_encode(["id_bar" => $con->insert_id]);
                        } else {
                            header("HTTP/1.1 500 Internal Server Error");
                        }
                    } catch (mysqli_sql_exception $e) {
                        header("HTTP/1.1 400 Bad Request");
                    }
                } else {
                    header("HTTP/1.1 400 Bad Request");
                }
            } else {
                header("HTTP/1.1 401 Unauthorized");
            }
        } catch (Exception $e) {
            header("HTTP/1.1 401 Unauthorized");
        }
    } else {
        header("HTTP/1.1 401 Unauthorized");
    }
    exit;
}

/**
 * Maneja solicitudes PUT para crear un nuevo bar.
 * 
 * Parámetros requeridos (PUT):
 * - id, nombre, direccion, telefono, latitud, longitud, hora_apertura, hora_cierre.
 * 
 * Autorización:
 * - Requiere token JWT válido con tipo "admin".
 * 
 * Respuestas:
 * - 200 OK: Bar actualizado con éxito, devuelve el ID.
 * - 400 Bad Request: Parámetros inválidos.
 * - 401 Unauthorized: Usuario no autorizado.
 * - 404 Not Found: No se encontro el bar a actualizar.
 */
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $jwt = trim(trim($headers['Authorization'], "Bearer"));
        try {
            $payload = decodeJWT($jwt);
            $tipo = $payload->tipo;
            if ($tipo === "admin") {
                parse_str(file_get_contents('php://input'), $put);
                if (isset($put['id']) && isset($put['nombre']) && isset($put['direccion'])
                    && isset($put['telefono']) && isset($put['hora_apertura'])
                    && isset($put['hora_cierre'])) {
                    $id = $put['id'];
                    $nombre = $put['nombre'];
                    $direccion = $put['direccion'];
                    $telefono = $put['telefono'];
                    $hora_apertura = $put['hora_apertura'];
                    $hora_cierre = $put['hora_cierre'];

                    $sql = "UPDATE bares SET nombre='$nombre', direccion='$direccion',
                            telefono='$telefono', hora_apertura='$hora_apertura', hora_cierre='$hora_cierre'
                            WHERE id_bar='$id'";
                    try {
                        $con->query($sql);
                        if ($con->affected_rows > 0) {
                            header("HTTP/1.1 200 OK");
                            echo json_encode(["id_bar" => $id]);
                        } else {
                            header("HTTP/1.1 404 Not Found");
                        }
                    } catch (mysqli_sql_exception $e) {
                        header("HTTP/1.1 400 Bad Request");
                    }
                } else {
                    header("HTTP/1.1 400 Bad Request");
                }
            } else {
                header("HTTP/1.1 401 Unauthorized");
            }
        } catch (Exception $e) {
            header("HTTP/1.1 401 Unauthorized");
        }
    } else {
        header("HTTP/1.1 401 Unauthorized");
    }
    exit;
}

/**
 * Maneja solicitudes DELETE para eliminar un bar.
 * 
 * Parámetros requeridos (DELETE):
 * - id: ID del bar.
 * 
 * Autorización:
 * - Requiere token JWT válido con tipo "admin".
 * 
 * Respuestas:
 * - 200 OK: Bar eliminado con éxito, devuelve el ID.
 * - 400 Bad Request: Parámetros inválidos.
 * - 401 Unauthorized: Usuario no autorizado.
 * - 404 Not Found: No se encontro el bar a eliminar.
 */
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $jwt = trim(trim($headers['Authorization'], "Bearer"));
        try {
            $payload = decodeJWT($jwt);
            $tipo = $payload->tipo;
            if ($tipo === "admin") {
                if (isset($_GET['id'])) {
                    $id = $_GET['id'];
                    $sql = "DELETE FROM bares WHERE id_bar='$id'";
                    try {
                        $con->query($sql);
                        if ($con->affected_rows > 0) {
                            header("HTTP/1.1 200 OK");
                            echo json_encode(["id_bar" => $id]);
                        } else {
                            header("HTTP/1.1 404 Not Found");
                        }
                    } catch (mysqli_sql_exception $e) {
                        header("HTTP/1.1 400 Bad Request");
                    }
                } else {
                    header("HTTP/1.1 400 Bad Request");
                }
            } else {
                header("HTTP/1.1 401 Unauthorized");
            }
        } catch (Exception $e) {
            header("HTTP/1.1 401 Unauthorized");
        }
    } else {
        header("HTTP/1.1 401 Unauthorized");
    }
    exit;
}

header("HTTP/1.1 400 Bad Request"); 
?>