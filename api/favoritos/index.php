<?php
/**
 * Este archivo gestiona las operaciones CRUD sobre la tabla "favoritos".
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
 * Maneja solicitudes GET para obtener los favoritos de un cliente o el total de favoritos de una tapa específica.
 * 
 * Autorización:
 * - Requiere un token JWT válido en el encabezado Authorization para obtener los favoritos de un cliente.
 * 
 * Parámetros opcionales (GET):
 * - tapa: ID de la tapa.
 * 
 * Respuestas:
 * - 200 OK:
 *   - Si se pasa el parámetro `tapa`, devuelve el ID de la tapa y el total de favoritos.
 *   - Si no se pasa el parámetro `tapa`, devuelve una lista de favoritos (id_favorito y tapa) para el cliente autenticado.
 * - 401 Unauthorized: 
 *   - Falta o es inválido el token JWT en el encabezado Authorization.
 * - 404 Not Found:
 *   - Si se proporciona un ID de tapa y no se encuentra la tapa o no tiene favoritos asociados.
 *   - Si no se encuentran favoritos para el cliente autenticado.
 * - 500 Internal Server Error: Error interno en el servidor.
 */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['tapa'])) {
        $tapaId = intval($_GET['tapa']);

        $sql = "SELECT COUNT(*) AS total_favoritos FROM favoritos WHERE tapa = $tapaId";

        try {
            $result = $con->query($sql);
            if ($result && $result->num_rows > 0) {
                $data = $result->fetch_assoc();
                header("HTTP/1.1 200 OK");
                echo json_encode(['tapa' => $tapaId, 'total_favoritos' => (int) $data['total_favoritos']]);
            } else {
                header("HTTP/1.1 404 Not Found");
            }
        } catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
        }
    } else {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $jwt = trim(trim($headers['Authorization'], "Bearer"));
            try {
                $payload = decodeJWT($jwt);
                $userId = $payload->id;
                    $sql = "SELECT id_favorito, tapa FROM favoritos WHERE cliente = '$userId'";

                    try {
                        $result = $con->query($sql);
                        if ($result && $result->num_rows > 0) {
                            $favoritos = $result->fetch_all(MYSQLI_ASSOC);
                            header("HTTP/1.1 200 OK");
                            echo json_encode($favoritos);
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
            header("HTTP/1.1 401 Unauthorized");
        }
    }
    exit;
}

/**
 * Maneja solicitudes POST para registrar un nuevo favorito.
 * 
 * Autorización:
 * - Requiere un token JWT válido en el encabezado Authorization.
 * 
 * Parámetros requeridos (POST):
 * - tapa: ID de la tapa favorita.
 * 
 * Respuestas:
 * - 201 Created: Favorito registrado con éxito, devuelve el ID del favorito.
 * - 400 Bad Request: Parámetros incompletos o error en la base de datos.
 * - 401 Unauthorized: Token inválido.
 * - 500 Internal Server Error: Error en el servidor.
 */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $jwt = trim(trim($headers['Authorization'], "Bearer"));
        try {
            $payload = decodeJWT($jwt);
            $userId = $payload->id;

            if (isset($_POST['tapa'])) {
                $tapa = $_POST['tapa'];

                $sql = "INSERT INTO favoritos (cliente, tapa) VALUES ('$userId', '$tapa')";

                try {
                    $con->query($sql);
                    if ($con->affected_rows > 0) {
                        $newFavoritoId = $con->insert_id;
                        header("HTTP/1.1 201 Created");
                        echo json_encode(["tapa" => $newFavoritoId]);
                    } else {
                        header("HTTP/1.1 500 Internal Server Error");
                    }
                } catch (mysqli_sql_exception $e) {
                    header("HTTP/1.1 400 Bad Request");
                }
            } else {
                header("HTTP/1.1 400 Bad Request");
            }
        } catch (Exception $e) {
            header("HTTP/1.1 401 Unauthorized");
            echo json_encode(["error" => "Token inválido"]);
        }
    } else {
        header("HTTP/1.1 401 Unauthorized");
    }
    exit;
}

/**
 * Maneja solicitudes DELETE para eliminar un favorito.
 * 
 * Autorización:
 * - Requiere un token JWT válido en el encabezado Authorization.
 * 
 * Parámetros requeridos (GET):
 * - tapa: ID de la tapa para eliminar su favorito.
 * 
 * Respuestas:
 * - 200 OK: Eliminación exitosa, devuelve el ID del favorito eliminado.
 * - 400 Bad Request: Falta el parámetro tapa o error en la base de datos.
 * - 401 Unauthorized: Token inválido.
 * - 404 Not Found: favorito no encontrado o no pertenece al cliente.
 */
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $jwt = trim(trim($headers['Authorization'], "Bearer"));
        try {
            $payload = decodeJWT($jwt);
            $userId = $payload->id;

            if (isset($_GET['tapa'])) {
                $tapa = $_GET['tapa'];

                $sql = "DELETE FROM favoritos WHERE tapa = '$tapa' AND cliente = '$userId'";

                try {
                    $con->query($sql);
                    if ($con->affected_rows > 0) {
                        header("HTTP/1.1 200 OK");
                        echo json_encode(["tapa" => $tapa]);
                    } else {
                        header("HTTP/1.1 404 Not Found");
                    }
                } catch (mysqli_sql_exception $e) {
                    header("HTTP/1.1 400 Bad Request");
                }
            } else {
                header("HTTP/1.1 400 Bad Request");
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