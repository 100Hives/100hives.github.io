<?php
/**
 * Release Therapies - Contact Form Handler
 * This script processes the contact form submission
 */

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize inputs
    $name = sanitizeInput($_POST["name"] ?? "");
    $email = sanitizeInput($_POST["email"] ?? "");
    $phone = sanitizeInput($_POST["phone"] ?? "");
    $subject = sanitizeInput($_POST["subject"] ?? "");
    $message = sanitizeInput($_POST["message"] ?? "");
    
    // Validate required fields
    $errors = [];
    
    if (empty($name)) {
        $errors[] = "Name is required";
    }
    
    if (empty($email)) {
        $errors[] = "Email address is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    if (empty($subject)) {
        $errors[] = "Subject is required";
    }
    
    if (empty($message)) {
        $errors[] = "Message is required";
    }
    
    // If there are validation errors, redirect back with error message
    if (!empty($errors)) {
        $errorMessage = urlencode(implode(", ", $errors));
        header("Location: ../contact.html?status=error&message=$errorMessage");
        exit;
    }
    
    // Prepare email content
    $to = "info@releasetherapies.co.uk"; // Updated email address
    $emailSubject = "Contact Form: $subject";
    
    $emailMessage = "
    <html>
    <head>
        <title>Contact Form Submission</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .message-details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
            h2 { color: #4a7c59; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; }
        </style>
    </head>
    <body>
        <h2>New Contact Form Submission</h2>
        <div class='message-details'>
            <div class='section'>
                <p><span class='label'>Name:</span> $name</p>
                <p><span class='label'>Email:</span> $email</p>";
    
    if (!empty($phone)) {
        $emailMessage .= "<p><span class='label'>Phone:</span> $phone</p>";
    }
    
    $emailMessage .= "
                <p><span class='label'>Subject:</span> $subject</p>
            </div>
            
            <div class='section'>
                <h3>Message</h3>
                <p>" . nl2br($message) . "</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Set email headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: $name <$email>" . "\r\n";
    
    // Send email
    $mailSent = mail($to, $emailSubject, $emailMessage, $headers);
    
    // Send confirmation email to the user
    $confirmationSubject = "Thank You for Contacting Release Therapies";
    $confirmationMessage = "
    <html>
    <head>
        <title>Contact Form Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .confirmation { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
            h2 { color: #4a7c59; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <h2>Thank You for Contacting Us</h2>
        <div class='confirmation'>
            <p>Dear $name,</p>
            <p>Thank you for reaching out to Release Therapies. We have received your message regarding \"$subject\".</p>
            <p>Our team will review your inquiry and get back to you as soon as possible, typically within 1-2 business days.</p>
            <p>If you have any urgent matters, please feel free to call us directly at +44 7123 456789.</p>
        </div>
        <div class='footer'>
            <p>Best Regards,<br>
            The Release Therapies Team</p>
            <hr>
            <p style='font-size: 12px; color: #666;'>
            Release Therapies<br>
            45 Therapy Lane<br>
            London, UK SW1 2AB<br>
            Phone: +44 7123 456789<br>
            Email: info@releasetherapies.co.uk</p>
        </div>
    </body>
    </html>
    ";
    
    $confirmationHeaders = "MIME-Version: 1.0" . "\r\n";
    $confirmationHeaders .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $confirmationHeaders .= "From: Release Therapies <info@releasetherapies.co.uk>" . "\r\n";
    
    $confirmationSent = mail($email, $confirmationSubject, $confirmationMessage, $confirmationHeaders);
    
    // Redirect based on email sending status
    if ($mailSent) {
        header("Location: ../thank-you.html");
    } else {
        $errorMessage = urlencode("There was an error sending your message. Please try again or contact us directly.");
        header("Location: ../contact.html?status=error&message=$errorMessage");
    }
    
    exit;
} else {
    // If the form wasn't submitted properly, redirect to the contact page
    header("Location: ../contact.html");
    exit;
}

/**
 * Sanitizes user input
 * @param string $data - The data to sanitize
 * @return string - The sanitized data
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>
