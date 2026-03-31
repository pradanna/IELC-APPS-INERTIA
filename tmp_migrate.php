<?php
$envPath = __DIR__ . '/.env';
$env = parse_ini_file($envPath);

$host = $env['DB_HOST'] ?? '127.0.0.1';
$port = $env['DB_PORT'] ?? '3306';
$dbname = $env['DB_DATABASE'] ?? 'laravel';
$user = $env['DB_USERNAME'] ?? 'root';
$password = $env['DB_PASSWORD'] ?? '';

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    
    // Check if columns exist
    $stmt = $pdo->query("SHOW COLUMNS FROM leads LIKE 'pending_profile_data'");
    if ($stmt->rowCount() == 0) {
        $pdo->exec("ALTER TABLE leads ADD COLUMN pending_profile_data TEXT DEFAULT NULL AFTER notes");
        $pdo->exec("ALTER TABLE leads ADD COLUMN is_profile_pending BOOLEAN DEFAULT 0 AFTER pending_profile_data");
        echo "Columns added successfully.\n";
    } else {
        echo "Columns already exist.\n";
    }
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
