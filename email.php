
<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html#contact');
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$messageText = trim($_POST['message'] ?? '');

if (!$name || !$email || !$messageText || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: index.html#contact?status=error');
    exit;
}

$to = 'lenoxochieng903@gmail.com';
$subject = 'New message from website contact form';
$message = "Name: $name\nEmail: $email\n\nMessage:\n$messageText\n";
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

mail($to, $subject, $message, $headers);

header('Location: index.html#contact?status=sent');
exit;
?>
