<?php
/**
 * Release Therapies - Booking Form Handler
 * This script processes the booking form submission
 */

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize inputs
    $fullName = sanitizeInput($_POST["fullName"] ?? "");
    $email = sanitizeInput($_POST["email"] ?? "");
    $phone = sanitizeInput($_POST["phone"] ?? "");
    $address = sanitizeInput($_POST["address"] ?? "");
    $city = sanitizeInput($_POST["city"] ?? "");
    $zipCode = sanitizeInput($_POST["zipCode"] ?? "");
    $serviceType = sanitizeInput($_POST["serviceType"] ?? "");
    $therapist = sanitizeInput($_POST["therapist"] ?? "");
    $appointmentDate = sanitizeInput($_POST["appointmentDate"] ?? "");
    $appointmentTime = sanitizeInput($_POST["appointmentTime"] ?? "");
    $alternateDate = sanitizeInput($_POST["alternateDate"] ?? "");
    $duration = sanitizeInput($_POST["duration"] ?? "");
    $healthConcerns = sanitizeInput($_POST["healthConcerns"] ?? "");
    $injuries = sanitizeInput($_POST["injuries"] ?? "");
    $allergies = sanitizeInput($_POST["allergies"] ?? "");
    $goals = sanitizeInput($_POST["goals"] ?? "");
    $firstVisit = isset($_POST["firstVisit"]) ? "Yes" : "No";
    $insurance = isset($_POST["insurance"]) ? "Yes" : "No";
    $insuranceProvider = sanitizeInput($_POST["insuranceProvider"] ?? "");
    $policyNumber = sanitizeInput($_POST["policyNumber"] ?? "");
    $additionalNotes = sanitizeInput($_POST["additionalNotes"] ?? "");
    $termsAgree = isset($_POST["termsAgree"]) ? "Yes" : "No";
    
    // Validate required fields
    $errors = [];
    
    if (empty($fullName)) {
        $errors[] = "Full name is required";
    }
    
    if (empty($email)) {
        $errors[] = "Email address is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    if (empty($phone)) {
        $errors[] = "Phone number is required";
    }
    
    if (empty($serviceType)) {
        $errors[] = "Service type is required";
    }
    
    if (empty($appointmentDate)) {
        $errors[] = "Appointment date is required";
    }
    
    if (empty($appointmentTime)) {
        $errors[] = "Appointment time is required";
    }
    
    if (empty($duration)) {
        $errors[] = "Session duration is required";
    }
    
    if ($termsAgree !== "Yes") {
        $errors[] = "You must agree to the terms and conditions";
    }
    
    // If there are validation errors, redirect back with error message
    if (!empty($errors)) {
        $errorMessage = urlencode(implode(", ", $errors));
        header("Location: ../booking.html?status=error&message=$errorMessage");
        exit;
    }
    
    // Prepare email content
    $to = "bookings@releasetherapies.co.uk"; // Updated email address
    $subject = "New Booking Request from $fullName";
    
    $message = "
    <html>
    <head>
        <title>New Booking Request</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .booking-details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
            h2 { color: #4a7c59; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; }
        </style>
    </head>
    <body>
        <h2>New Booking Request</h2>
        <div class='booking-details'>
            <div class='section'>
                <h3>Personal Information</h3>
                <p><span class='label'>Name:</span> $fullName</p>
                <p><span class='label'>Email:</span> $email</p>
                <p><span class='label'>Phone:</span> $phone</p>";
    
    if (!empty($address) || !empty($city) || !empty($zipCode)) {
        $message .= "
                <p><span class='label'>Address:</span> $address</p>
                <p><span class='label'>City:</span> $city</p>
                <p><span class='label'>Zip Code:</span> $zipCode</p>";
    }
    
    $message .= "
            </div>
            
            <div class='section'>
                <h3>Appointment Details</h3>
                <p><span class='label'>Service:</span> $serviceType</p>";
    
    if (!empty($therapist)) {
        $message .= "<p><span class='label'>Preferred Therapist:</span> $therapist</p>";
    }
    
    $message .= "
                <p><span class='label'>Date:</span> $appointmentDate</p>
                <p><span class='label'>Time:</span> $appointmentTime</p>";
    
    if (!empty($alternateDate)) {
        $message .= "<p><span class='label'>Alternate Date:</span> $alternateDate</p>";
    }
    
    $message .= "
                <p><span class='label'>Duration:</span> $duration</p>
                <p><span class='label'>First Visit:</span> $firstVisit</p>
            </div>
            
            <div class='section'>
                <h3>Health Information</h3>";
    
    if (!empty($healthConcerns)) {
        $message .= "<p><span class='label'>Health Concerns:</span> $healthConcerns</p>";
    }
    
    if (!empty($injuries)) {
        $message .= "<p><span class='label'>Injuries/Surgeries:</span> $injuries</p>";
    }
    
    if (!empty($allergies)) {
        $message .= "<p><span class='label'>Allergies:</span> $allergies</p>";
    }
    
    if (!empty($goals)) {
        $message .= "<p><span class='label'>Goals:</span> $goals</p>";
    }
    
    $message .= "
                <p><span class='label'>Using Insurance:</span> $insurance</p>";
    
    if ($insurance === "Yes" && (!empty($insuranceProvider) || !empty($policyNumber))) {
        $message .= "
                <p><span class='label'>Insurance Provider:</span> $insuranceProvider</p>
                <p><span class='label'>Policy Number:</span> $policyNumber</p>";
    }
    
    $message .= "
            </div>";
    
    if (!empty($additionalNotes)) {
        $message .= "
            <div class='section'>
                <h3>Additional Notes</h3>
                <p>$additionalNotes</p>
            </div>";
    }
    
    $message .= "
        </div>
    </body>
    </html>
    ";
    
    // Set email headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: $fullName <$email>" . "\r\n";
    
    // Send email
    $mailSent = mail($to, $subject, $message, $headers);
    
    // Send confirmation email to the client
    $clientSubject = "Your Booking Request - Release Therapies";
    $clientMessage = "
    <html>
    <head>
        <title>Booking Request Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .confirmation { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
            h2 { color: #4a7c59; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <h2>Thank You for Your Booking Request</h2>
        <div class='confirmation'>
            <p>Dear $fullName,</p>
            <p>We have received your booking request for a $duration $serviceType session on $appointmentDate at $appointmentTime.</p>
            <p>Our team will review your request and contact you shortly to confirm your appointment.</p>
            <p>If you have any questions or need to make changes to your booking, please contact us at:</p>
            <p>Phone: +44 7123 456789<br>Email: bookings@releasetherapies.co.uk</p>
        </div>
        <div class='footer'>
            <p>Release Therapies<br>
            45 Therapy Lane<br>
            London, UK SW1 2AB</p>
        </div>
    </body>
    </html>
    ";
    
    $clientHeaders = "MIME-Version: 1.0" . "\r\n";
    $clientHeaders .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $clientHeaders .= "From: Release Therapies <bookings@releasetherapies.co.uk>" . "\r\n";
    
    $clientMailSent = mail($email, $clientSubject, $clientMessage, $clientHeaders);
    
    // Redirect based on email sending status
    if ($mailSent) {
        header("Location: ../thank-you.html");
    } else {
        $errorMessage = urlencode("There was an error processing your booking. Please try again or contact us directly.");
        header("Location: ../booking.html?status=error&message=$errorMessage");
    }
    
    exit;
} else {
    // If the form wasn't submitted properly, redirect to the booking page
    header("Location: ../booking.html");
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
