const toggleVisibilityBtn = document.getElementById('toggleVisibilityBtn');
const confirm_toggleVisibilityBtn = document.getElementById('confirm_toggleVisibilityBtn');
const signUpBtn = document.getElementById('sign-up-btn')
// UsernameInput
const usernameInput = document.getElementById('username_input');
const usernameFeedback = document.getElementById('usernameFeedback')

// PasswordInput
const passwordInput = document.getElementById("passwordInput");
const phoneNumberInput = document.getElementById('phoneNumberInput')

// Email
const emailInput = document.getElementById('email_input')
const emailFeedback = document.getElementById('emailFeedback')

// visibiltyIcon
const visibilityIcon = document.getElementById("visibilityIcon");

// confirmPassword
const confirm_passwordInput = document.getElementById("confirm_passwordInput");
const confirm_visibilityIcon = document.getElementById("confirm_visibilityIcon");
const confirmPasswordFeedback = document.getElementById('confirmPasswordFeedback');

// Login Btn
const loginBtn = document.getElementById('loginBtn')


function togglePasswordVisibility() {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        visibilityIcon.classList.remove("bi-eye-fill")
        visibilityIcon.classList.add("bi-eye-slash-fill");
    } else {
        passwordInput.type = "password";
        visibilityIcon.classList.remove("bi-eye-slash-fill");
        visibilityIcon.classList.add("bi-eye-fill");
    }
}

function confirmTogglePasswordVisibility() {
    if (confirm_passwordInput.type === "password") {
        confirm_passwordInput.type = "text";
        confirm_visibilityIcon.classList.remove("bi-eye-fill")
        confirm_visibilityIcon.classList.add("bi-eye-slash-fill");
    } else {
        confirm_passwordInput.type = "password";
        confirm_visibilityIcon.classList.remove("bi-eye-slash-fill");
        confirm_visibilityIcon.classList.add("bi-eye-fill");
    }
}

function validatePassword() {
    const password = passwordInput.value
    const confirm = confirm_passwordInput.value

    if (password !== confirm) {
        // Passwords don't match
        confirm_passwordInput.classList.add('is-invalid')
        confirmPasswordFeedback.classList.add('invalid-feedback')
        confirmPasswordFeedback.textContent = "Passwords don't match"
        signUpBtn.setAttribute('disabled', true)
    } else {
        // Passwords match
        confirm_passwordInput.classList.remove('is-invalid')
        confirm_passwordInput.classList.add('is-valid')
        confirmPasswordFeedback.classList.remove('invalid-feedback')
        confirmPasswordFeedback.textContent = '';
    }
}


toggleVisibilityBtn.addEventListener('click', function () {
    togglePasswordVisibility();
})

confirm_toggleVisibilityBtn.addEventListener('click', function () {
    confirmTogglePasswordVisibility()
})

confirm_passwordInput.addEventListener('input', validatePassword);

// Check availability of username from server
usernameInput.addEventListener('blur', async function () {
    const username = usernameInput.value
    if (username.length > 0) {
        // Make async request to the server
        const response = await fetch('/check-username', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ username })
        })

        // Handle the response
        const data = await response.json();
        if (data.result === "available") {
            usernameInput.classList.remove('is-invalid')
            usernameInput.classList.add('is-valid')
            usernameFeedback.textContent = "Username is available"
        } else {
            usernameInput.classList.remove('is-valid')
            usernameInput.classList.add('is-invalid')
            usernameFeedback.textContent = "Username is already taken"
            signUpBtn.setAttribute('disabled', true)
        }
    }
})

// Email Verification
function validateEmail() {
    email = emailInput.value
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(email)) {
        emailInput.classList.remove("is-invalid")
        emailInput.classList.add("is-valid")
        emailFeedback.classList.remove('invalid-feedback')
        emailFeedback.classList.add('valid-feedback')
        emailFeedback.textContent = "Valid Email Address"
        return true;
    } else {
        emailInput.classList.remove('is-valid')
        emailInput.classList.add('is-invalid')
        emailFeedback.classList.remove('valid-feedback')
        emailFeedback.classList.add('invalid-feedback')
        emailFeedback.textContent = 'Invalid Email Address'
        return false;
    }
    
}

emailInput.addEventListener('input', validateEmail)

// Check availability of email from server
emailInput.addEventListener('blur', async function () {
    const email = emailInput.value
    if (email.length > 0) {
        // Make async request to the server
        const response = await fetch('/check-email', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ email })
        })
        // Handle the response
        const data = await response.json();
        if (data.result === "available") {
            emailInput.classList.remove('is-invalid')
            emailInput.classList.add('is-valid')
            emailFeedback.classList.remove('invalid-feedback')
            emailFeedback.classList.add('valid-feedback')
            emailFeedback.textContent = "Email Address is Available"
        } else {
            emailInput.classList.remove('is-valid')
            emailInput.classList.add('is-invalid')
            emailFeedback.classList.remove('valid-feedback')
            emailFeedback.classList.add('invalid-feedback')
            emailFeedback.textContent = "Email is associated with an account"
            signUpBtn.setAttribute('disabled', true)
        }
    }
})


// Phone Number Verification
function validatePhoneNumber() {
    phoneNumber = phoneNumberInput.value
    const phoneRegex = /^7\d{8}$/;
    if (phoneRegex.test(phoneNumber)) {
        phoneNumberInput.classList.remove("is-invalid")
        phoneNumberInput.classList.add("is-valid")
        phoneNumberFeedback.classList.remove('invalid-feedback')
        phoneNumberFeedback.classList.add('valid-feedback')
        phoneNumberFeedback.textContent = "Valid Phone Number"
        signUpBtn.removeAttribute('disabled')
        return true;
    } else {
        phoneNumberInput.classList.remove('is-valid')
        phoneNumberInput.classList.add('is-invalid')
        phoneNumberFeedback.classList.remove('valid-feedback')
        phoneNumberFeedback.classList.add('invalid-feedback')
        phoneNumberFeedback.textContent = 'Invalid Phone Number'
console.log("Invalid Phone Number")
        return false;
    }
}

phoneNumberInput.addEventListener('input', validatePhoneNumber)

// User Registration
const registrationForm = document.getElementById('signUpForm');

registrationForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Validate before sending to the server
    username = usernameInput.value
    email = emailInput.value
    password = passwordInput.value
    phone = phoneNumberInput.value

    if (validatePhoneNumber && validateEmail) {
        const userData = {
            username: usernameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            phone : `+254${phoneNumberInput.value}`
        };

        const request = new XMLHttpRequest();
        request.open('POST', '/user-registration', true);
        request.setRequestHeader('Content-Type', 'application/json');


        // AJAX Response
        request.onload = function () {
            if (request.status === 200) {
                const response = JSON.parse(request.responseText)
                console.log(response.message);
                window.location.href="login"
            } else {
                // Registration failed, render a toast
                console.log("ERROR Occured on Registration")
            }
        };

        // Convert user data to JSON
        const userJsonData = JSON.stringify(userData)

        // Send the data
        request.send(userJsonData)

    } else {
        console.log("Cannot send USER REGISTRATION REQUEST")
    }
    
});


