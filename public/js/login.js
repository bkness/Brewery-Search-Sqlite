// LOGIN HANDLER
const loginformhandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector("#loginName").value.trim();
  const password = document.querySelector("#loginPassword").value.trim();

  if (email && password) {
    const response = await fetch("/api/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/");
    } else {
      const data = await response.json();
      const errorBox = document.querySelector("#loginError");
      errorBox.textContent = data.message || "Login failed";
      errorBox.style.display = "block";
    }
  }
};

// Email validation
document.querySelector("#createEmail").addEventListener("input", () => {
  const email = document.querySelector("#createEmail").value.trim();
  const errorBox = document.querySelector("#signupError");

  if (!email.includes("@")) {
    errorBox.textContent = "Please enter a valid email address.";
    errorBox.style.display = "block";
  } else {
    errorBox.textContent = "";
    errorBox.style.display = "none";
  }
});

// Username validation
document.querySelector("#createName").addEventListener("input", () => {
  const name = document.querySelector("#createName").value.trim();
  const errorBox = document.querySelector("#signupError");

  if (name.length < 3) {
    errorBox.textContent = "Username must be at least 3 characters long.";
    errorBox.style.display = "block";
  } else {
    errorBox.textContent = "";
    errorBox.style.display = "none";
  }
});

// Password validation
document.querySelector("#createPassword").addEventListener("input", () => {
  const password = document.querySelector("#createPassword").value.trim();
  const errorBox = document.querySelector("#signupError");

  if (password.length < 8) {
    errorBox.textContent = "Password must be at least 8 characters long.";
    errorBox.style.display = "block";
  } else {
    errorBox.textContent = "";
    errorBox.style.display = "none";
  }
});

// SIGNUP HANDLER
const signupformhandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector("#createEmail").value.trim();
  const name = document.querySelector("#createName").value.trim();
  const password = document.querySelector("#createPassword").value.trim();
  const errorBox = document.querySelector("#signupError");

  if (!email || !name || !password) {
    errorBox.textContent = "All fields are required.";
    errorBox.style.display = "block";
    return;
  }

  const response = await fetch("/api/user/", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/");
  } else {
    const data = await response.json();
    errorBox.textContent = data.message || "Signup failed";
    errorBox.style.display = "block";
  }
};

// EVENT LISTENERS
document
  .querySelector("#loginSubmit")
  .addEventListener("click", loginformhandler);

document
  .querySelector("#signupSubmit")
  .addEventListener("click", signupformhandler);

// Show login error when clicking username field
document.querySelector("#loginName").addEventListener("focus", () => {
  const errorBox = document.querySelector("#loginError");
  errorBox.textContent = "Please enter your login credentials.";
  errorBox.style.display = "block";
});

// Show login error when clicking password field
document.querySelector("#loginPassword").addEventListener("focus", () => {
  const errorBox = document.querySelector("#loginError");
  errorBox.textContent = "Please enter your login credentials.";
  errorBox.style.display = "block";
});

document
  .querySelector("#loginPassword")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      loginformhandler(event);
    }
  });
