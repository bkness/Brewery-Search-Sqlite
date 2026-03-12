// const loginform = document.getElementById("login-form");
// const loginButton = document.getElementById("login-form-submit");

const loginformhandler = async (event) => {
    event.preventDefault();
    console.log('hello')
    const name = document.querySelector('#loginName').value.trim();
    const password = document.querySelector('#loginPassword').value.trim();

    if (name && password) {
        const response = await fetch('api/user/login', {
            method: 'POST',
            body: JSON.stringify({ name, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/');
        } else {
            alert("Check your Username or Password");
        }
    }
};

// loginform.addEventListener('submit', loginformhandler);

const signupformhandler = async (event) => {
    event.preventDefault();
    // console.log("hi");
    const email = document.querySelector('#createEmail').value.trim();
    const username = document.querySelector('#createName').value.trim();
    const password = document.querySelector('#createPassword').value.trim();
    // console.log(email);
    if (email && username && password) {
        const response = await fetch('/api/user/', {
            method: 'POST',
            body: JSON.stringify({ email, username, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/');
        } else {
            alert(response.status);
        }
    }
};

document.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        loginformhandler(event);
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        signupformhandler(event);
    }
});

document.querySelector('#loginSubmit').addEventListener('click', loginformhandler);
document.querySelector('#signupSubmit').addEventListener('click', signupformhandler);