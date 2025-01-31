<?php
/**
 * Definición de constantes utilizadas para generar y verificar JWT (JSON Web Tokens).
 * 
 * CLAVE define la clave secreta utilizada para firmar el token.
 * ALG define el algoritmo de firma (HS512 en este caso).
 */
define("CLAVE", "miclavesecreta");
define("ALG", "HS512");

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/**
 * Genera un JSON Web Token (JWT) para un usuario específico.
 *
 * Este token se firma utilizando la clave secreta definida en la constante CLAVE
 * y el algoritmo especificado en ALG. El token contiene la información del usuario
 * y su fecha de expiración.
 *
 * @param int $userId El ID del usuario.
 * @param string $username El nombre de usuario.
 * @param string $tipo El tipo de usuario o rol.
 * 
 * @return string El JWT generado.
 */
function generateJWT($userId, $username, $tipo) {
    global $secretKey;
    $iat = time();  // Tiempo de emisión del token
    $exp = $iat + 3600;  // Expiración del token, 1 hora después de la emisión
    $payload = array(
        "iat" => $iat,
        "exp" => $exp,
        "id" => $userId,
        "username" => $username,
        "tipo" => $tipo
    );
    return JWT::encode($payload, CLAVE, ALG);  // Codifica el payload y devuelve el JWT
}

/**
 * Decodifica un JSON Web Token (JWT) para verificar su validez.
 * 
 * Intenta decodificar el JWT utilizando la clave secreta y el algoritmo
 * definido. Si el token es válido, devuelve el payload decodificado; 
 * de lo contrario, devuelve null.
 *
 * @param string $jwt El JWT a decodificar.
 * 
 * @return object|null El payload decodificado del JWT si es válido, null si no lo es.
 */
function decodeJWT($jwt) {
    try {
        return JWT::decode($jwt, new Key(CLAVE, ALG));  // Decodifica el token usando la clave y el algoritmo
    } catch (Exception $e) {
        return null;  // Si ocurre un error (token no válido), devuelve null
    }
}
?>