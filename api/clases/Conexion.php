<?php
/**
 * Clase que extiende la clase mysqli para gestionar la conexión a la base de datos.
 * 
 * Esta clase establece una conexión a la base de datos especificada en los atributos
 * de la clase utilizando el constructor de mysqli. Si ocurre un error en la conexión,
 * se captura una excepción y se envía un error HTTP 500.
 */
class Conexion extends mysqli {
    /**
     * @var string $host El nombre del host de la base de datos.
     */
    private $host = "localhost";
    
    /**
     * @var string $db El nombre de la base de datos.
     */
    private $db = "tapleon";
    
    /**
     * @var string $user El nombre de usuario para conectarse a la base de datos.
     */
    private $user = "tapleon";
    
    /**
     * @var string $pass La contraseña asociada al usuario de la base de datos.
     */
    private $pass = "tapleon";

    /**
     * Constructor de la clase Conexion.
     * 
     * Intenta establecer una conexión con la base de datos utilizando los parámetros
     * de host, usuario, contraseña y base de datos. Si ocurre un error, captura la
     * excepción y termina la ejecución del script con un error HTTP 500.
     *
     * @throws mysqli_sql_exception Si ocurre un error en la conexión.
     */
    public function __construct() {
        try {
            parent::__construct($this->host, $this->user, $this->pass, $this->db);
        } catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 500 Internal Server Exception");
            exit;
        }
    }
}
?>