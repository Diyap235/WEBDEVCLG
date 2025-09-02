<?php
if 
($_SERVER["REQUEST_METHOD"] == "POST")
 {
    $username = htmlspecialchars($_POST['username']);
    $email = htmlspecialchars($_POST['email']);
    $password = $_POST['password'];

    $confirmPassword = $_POST['confirmPassword'];

    if ($password !== $confirmPassword) {
        echo "<h3 style='color:red;'>Passwords do not match!</h3>";
        echo "<a href='register.html'>Go Back</a>";
        exit;
    }
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $newUser = [
        "username" => $username,
        "email" => $email,
        "password" => $hashedPassword
    ];
    $file = "users.json";
    
    if (file_exists($file)) {
        $data = json_decode(file_get_contents($file), true);
    } else {
        $data = [];
    }

    $data[] = $newUser;

    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));

    echo "<h2 style='color:green;'>Registration Successfull ! Thanks For Regestering ,We Welcome!!</h2>";
    echo "<p>Welcome, <b>$username</b>. Your account has been created.</p>";
    echo "<a href='register.html'>Go Back</a>";
} else {
    echo "Invalid Request";
}
?>
