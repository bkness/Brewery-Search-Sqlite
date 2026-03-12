// const loginform = document.getElementById("login-form");
// const loginButton = document.getElementById("login-form-submit");

const loginformhandler = async (event) => {
    event.preventDefault();
    console.log('hello')
    const email = document.querySelector('#loginName').value.trim();
    const password = document.querySelector('#loginPassword').value.trim();

    if (email && password) {
        const response = await fetch('api/user/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
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
    const name = document.querySelector('#createName').value.trim();
    const password = document.querySelector('#createPassword').value.trim();
    // console.log(email);
    if (email && name && password) {
        const response = await fetch('/api/user/', {
            method: 'POST',
            body: JSON.stringify({ email, name, password }),
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