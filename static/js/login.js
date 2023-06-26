const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById('loginBtn')
const loginFeedback = document.getElementById('loginFeedback')

// visibiltyIcon
const visibilityIcon = document.getElementById("visibilityIcon");

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

toggleVisibilityBtn.addEventListener('click', function () {
    togglePasswordVisibility();
})

loginBtn.addEventListener('click', async function () {
    username = usernameInput.value
    password = passwordInput.value

    loginData = {
        username : username,
        password : password
    }

    if ((username.length > 0) && (password.length > 0)) {
        const response = await fetch ('/login/user-login', {
            method: 'POST', 
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(loginData)
        })

        const serverResponse = await response.json()
        if (serverResponse.login === "success"){
            window.location.href = "/home"
            console.log("SUCCESS LOGIN")

        } else {
            // Render Toast of invalid login details
            loginBtn.classList.add('is-invalid')
            loginFeedback.classList.add('invalid-feedback')
            loginFeedback.textContent = "Invalid Username or password"

            setTimeout(() => {
                loginBtn.classList.remove('is-invalid')
                loginFeedback.classList.remove('invalid-feeedbck')
                loginFeedback.textContent = "";
            }, 3000)
            console.log("No Account: ", serverResponse.login)
        }

    }
})
