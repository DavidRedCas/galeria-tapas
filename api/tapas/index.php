<?php
/**
 * Este archivo gestiona las operaciones CRUD sobre la tabla "tapas".
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
 * Maneja solicitudes GET para obtener información sobre las tapas.
 * 
 * Parámetros opcionales (GET):
 * - id: ID de la tapa.
 * - titulo: Título de la tapa.
 * - descripcion: Descripción de la tapa.
 * - bar: Bar de la tapa.
 * 
 * Respuestas:
 * - 200 OK: Devuelve las tapas encontradas en formato JSON.
 * - 400 Bad Request: Error en los parámetros.
 * - 404 Not Found: No se encontraron tapas.
 * - 500 Internal Server Error: Error en el servidor.
 */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM tapas WHERE 1 ";
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $sql .= "AND id_tapa='$id'";
    } elseif (count($_GET) < 5 && (isset($_GET['titulo']) || isset($_GET['descripcion']) || isset($_GET['bar']))) {
        if (isset($_GET['titulo'])) {
            $titulo = $_GET['titulo'];
            $sql .= "AND titulo LIKE '%$titulo%' ";
        }

        if (isset($_GET['descripcion'])) {
            $descripcion = $_GET['descripcion'];
            $sql .= "AND descripcion LIKE '%$descripcion%' ";
        }

        if (isset($_GET['bar'])) {
            $bar = $_GET['bar'];
            $sql .= "AND bar = '$bar' ";
        }
    } elseif (count($_GET) > 0) {
        header("HTTP/1.1 404 Bad Request");
        exit;
    }
    try {
        $result = $con->query($sql);
        if ($result and $result->num_rows > 0) {
            $tapas = $result->fetch_all(MYSQLI_ASSOC);
            header("HTTP/1.1 200 OK");
            echo json_encode($tapas);
        } else {
            header("HTTP/1.1 404 Not Found");
        }
    } catch (mysqli_sql_exception $e) {
        header("HTTP/1.1 404 Not Found");
    }
    exit;
}

/**
 * Maneja solicitudes POST para crear una nueva tapa.
 * 
 * Parámetros requeridos (POST):
 * - titulo, descripcion, bar.
 * - imagen (opcional).
 * 
 * Autorización:
 * - Requiere token JWT válido con tipo "admin".
 * 
 * Respuestas:
 * - 201 Created: Tapa creada con éxito, devuelve el ID.
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
                if (isset($_POST['titulo']) && isset($_POST['descripcion']) && isset($_POST['bar'])) {
                    $titulo = $_POST['titulo'];
                    $descripcion = $_POST['descripcion'];
                    $alt = $_POST['alt'];
                    $bar = $_POST['bar'];
                    $imagen = null;
                    if (isset($_POST['imagen']) && !empty($_POST['imagen'])) {
                        $imagen = $_POST['imagen'];
                    }

                    $columns = ['titulo', 'alt', 'descripcion', 'bar'];
                    $values = ["'$titulo'", "'$alt'", "'$descripcion'", "'$bar'"];

                    if ($imagen !== null) {
                        $columns[] = 'imagen';
                        $values[] = "'$imagen'"; // Añadimos su valor
                    }

                    // Crear la consulta SQL con las columnas y valores dinámicamente
                    $sql = "INSERT INTO tapas (" . implode(", ", $columns) . ") 
                                VALUES (" . implode(", ", $values) . ")";

                    try {
                        $con->query($sql);
                        if ($con->affected_rows > 0) {
                            header("HTTP/1.1 201 Created");
                            echo json_encode(["id_tapa" => $con->insert_id]);
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
 * Maneja solicitudes PUT para editar una tapa.
 * 
 * Parámetros requeridos (PUT):
 * - id, titulo, descripcion, bar.
 * 
 * Autorización:
 * - Requiere token JWT válido con tipo "admin".
 * 
 * Respuestas:
 * - 200 OK: Tapa actualizada con éxito, devuelve el ID.
 * - 400 Bad Request: Parámetros inválidos.
 * - 401 Unauthorized: Usuario no autorizado.
 * - 404 Not Found: No se encontró la tapa a actualizar.
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
                if (isset($put['id']) && isset($put['titulo']) && isset($put['descripcion']) && isset($put['bar'])) {
                    $id = $put['id'];
                    $titulo = $put['titulo'];
                    $descripcion = $put['descripcion'];
                    $bar = $put['bar'];

                    $sql = "UPDATE tapas SET titulo='$titulo', descripcion='$descripcion', bar='$bar' WHERE id_tapa='$id'";
                    try {
                        $con->query($sql);
                        if ($con->affected_rows > 0) {
                            header("HTTP/1.1 200 OK");
                            echo json_encode(["id_tapa" => $id]);
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
 * Maneja solicitudes DELETE para eliminar una tapa.
 * 
 * Parámetros requeridos (DELETE):
 * - id: ID de la tapa.
 * 
 * Autorización:
 * - Requiere token JWT válido con tipo "admin".
 * 
 * Respuestas:
 * - 200 OK: Tapa eliminada con éxito, devuelve el ID.
 * - 400 Bad Request: Parámetros inválidos.
 * - 401 Unauthorized: Usuario no autorizado.
 * - 404 Not Found: No se encontró la tapa a eliminar.
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
                    $sql = "DELETE FROM tapas WHERE id_tapa='$id'";
                    try {
                        $con->query($sql);
                        if ($con->affected_rows > 0) {
                            header("HTTP/1.1 200 OK");
                            echo json_encode(["id_tapa" => $id]);
                        } else {
                            header("HTTP/1.1 404 Not found");
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
