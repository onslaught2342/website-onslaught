function checkPasswordStrength() {
    const password = document.getElementById("password").value;
    const strengthText = document.getElementById("strength");
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++;

    strengthText.textContent = 
        strength < 3 ? "Weak Password" : 
        strength === 3 || strength === 4 ? "Medium Strength" : 
        "Strong Password";
    strengthText.className = `strength ${strength < 3 ? "weak" : strength === 3 || strength === 4 ? "medium" : "strong"}`;
}

function togglePasswordVisibility() {
    const passwordField = document.getElementById("password");
    const eyeIconOpen = document.getElementById("eyeIconOpen");
    const eyeIconClosed = document.getElementById("eyeIconClosed");
    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIconOpen.classList.add("hidden");
        eyeIconClosed.classList.remove("hidden");
    } else {
        passwordField.type = "password";
        eyeIconOpen.classList.remove("hidden");
        eyeIconClosed.classList.add("hidden");
    }
}

function generatePassword() {
    const length = parseInt(document.getElementById("lengthSlider").value);
    let charset = "";
    if (document.getElementById("includeLowercase").checked) charset += "abcdefghijklmnopqrstuvwxyz";
    if (document.getElementById("includeUppercase").checked) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (document.getElementById("includeNumbers").checked) charset += "0123456789";
    if (document.getElementById("includeSpecial").checked) charset += "!@#$%^&*()";

    if (!charset) {
        alert("Please select at least one character type.");
        return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    document.getElementById("generatedPassword").value = password;
}

function updateLengthLabel() {
    document.getElementById("lengthLabel").textContent = document.getElementById("lengthSlider").value;
}

updateLengthLabel();
