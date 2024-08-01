
<?php
$to = 'recipient-email@example.com';
$subject = 'Email Subject';
$message = 'Email Body';
$headers = 'From: your-email@example.com';
mail($to, $subject, $message, $headers);
?>
