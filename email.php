<?php

if (isset($_POST['submit'])) {
  $to = "lenoxochieng903@gmail.com";
  $subject = "Contact Form Submission";
  $message = "Name: " . $_POST['name'] . "\n";
  $message .= "Email: " . $_POST['email'] . "\n";
  $message .= "Message: " . $_POST['message'] . "\n";

  // Send the email
  mail($to, $subject, $message);
}

?>