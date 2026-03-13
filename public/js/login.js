const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const createFormController = ({
  form,
  fields,
  errorEl,
  validate,
  endpoint,
}) => {
  const formEl = $(form);
  const error = $(errorEl);

  const inputs = Object.fromEntries(
    Object.entries(fields).map(([key, selector]) => [key, $(selector)]),
  );

  const getValues = () =>
    Object.fromEntries(
      Object.entries(inputs).map(([k, el]) => [k, el.value.trim()]),
    );

  const validateForm = () => {
    const values = getValues();
    const message =
      validate(values) ||
      (isValidEmail(values.email) === false && "Please enter a valid email");

    if (message) {
      showError(error, message);
      return false;
    }

    clearError(error);
    return true;
  };

  Object.values(inputs).forEach((input) =>
    input.addEventListener("input", validateForm),
  );

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const button = formEl.querySelector("button[type='submit']");
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = "Processing...";

    const result = await sendRequest(endpoint, getValues());

    button.disabled = false;
    button.textContent = originalText;

    if (result.ok) {
      document.location.replace("/");
      return;
    }

    showError(error, result.data?.message || "Request failed");

    inputs.password.focus();
  });
};

// Dom Elements

// const login = {
//   email: $("#loginName"),
//   password: $("#loginPassword"),
//   submit: $("#loginSubmit"),
//   error: $("#loginError"),
// };

// const signup = {
//   name: $("#createName"),
//   email: $("#createEmail"),
//   password: $("#createPassword"),
//   submit: $("#signupSubmit"),
//   error: $("#signupError"),
// };

const setFieldState = (field, isValid) => {
  field.classList.remove("valid", "invalid");

  if (isValid === true) field.classList.add("valid");
  if (isValid === false) field.classList.add("invalid");
};

// Error Handling

const showError = (element, message) => {
  element.textContent = message;
  element.classList.add("show");
};

const clearError = (element) => {
  element.textContent = "";
  element.classList.remove("show");
};

// Validation

// const validateLogin = () => {
//   const email = login.email.value.trim();
//   const password = login.password.value.trim();

//   const emailValid = email.includes("@");
//   const passwordValid = password.length > 0;

//   setFieldState(login.email, emailValid);
//   setFieldState(login.password, passwordValid);

//   if (!emailValid) {
//     showError(login.error, "Please enter a valid email address.");
//     return false;
//   }

//   if (!passwordValid) {
//     showError(login.error, "Please enter your password.");
//     return false;
//   }

//   clearError(login.error);
//   return true;
// };

// if (!email.includes("@")) {
//   showError(login.error, "Please enter a valid email address.");
//   return false;
// }

// if (!password) {
//   showError(login.error, "Please enter your password.");
//   return false;
// }

// clearError(login.error);
// return true;
//};

// const validateSignup = () => {
//   const name = signup.name.value.trim();
//   const email = signup.email.value.trim();
//   const password = signup.password.value.trim();

//   if (name.length < 3) {
//     showError(signup.error, "Username must be at least 3 characters long.");
//     return false;
//   }

//   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   if (!isValidEmail(email)) {
//     showError(signup.error, "Please enter a valid email address.");
//     return false;
//   }

//   if (password.length < 6) {
//     showError(signup.error, "Password must be at least 6 characters long.");
//     return false;
//   }

//   clearError(signup.error);
//   return true;
// };

// Safe JSON Parse

const readJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

//API Requests

const sendRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  const data = await readJsonSafe(response);

  return { ok: response.ok, data };
};

// Login Handler

createFormController({
  form: "#loginForm",

  fields: {
    email: "#loginName",
    password: "#loginPassword",
  },

  errorEl: "#loginError",

  endpoint: "/api/user/login",

  validate: ({ email, password }) => {
    if (!email.includes("@")) return "Please enter a valid email";
    if (!password) return "Please enter your password";
  },
});

// const loginFormHandler = async (event) => {
//   event.preventDefault();

//   if (!validateLogin()) return;

//   const email = login.email.value.trim();
//   const password = login.password.value.trim();

//   const result = await sendRequest("/api/user/login", { email, password });

//   if (result.ok) {
//     document.location.replace("/");
//     return;
//   }

//   showError(
//     login.error,
//     result.data?.message || "Login failed. Please try again.",
//   );
//   login.password.value = "";
//   login.password.focus();
// };

// Signup Handler

createFormController({
  form: "#signupForm",

  fields: {
    name: "#createName",
    email: "#createEmail",
    password: "#createPassword",
  },

  errorEl: "#signupError",

  endpoint: "/api/user",

  validate: ({ name, email, password }) => {
    if (name.length < 3) return "Username must be at least 3 characters";

    if (!isValidEmail(email)) return "Please enter a valid email";

    if (password.length < 6) return "Password must be at least 6 characters";
  },
});

// const signupFormHandler = async (event) => {
//   event.preventDefault();

//   if (!validateSignup()) return;

//   const name = signup.name.value.trim();
//   const email = signup.email.value.trim();
//   const password = signup.password.value.trim();

//   const result = await sendRequest("/api/user", { name, email, password });

//   if (result.ok) {
//     document.location.replace("/");
//     return;
//   }

//   showError(
//     signup.error,
//     result.data?.message || "Signup failed. Please try again.",
//   );
//   signup.password.value = "";
// };

// Live Validation

// [login.email, login.password].forEach((input) => {
//   input.addEventListener("input", validateLogin);
// });

// [signup.name, signup.email, signup.password].forEach((input) => {
//   input.addEventListener("input", validateSignup);
// });

// Submit Button Handlers

// $("#loginForm").addEventListener("submit", loginFormHandler);
// $("#signupForm").addEventListener("submit", signupFormHandler);

// Password Toggle

$$(".toggle-pass").forEach((button) => {
  button.addEventListener("click", () => {
    const field = $(button.dataset.target);
    if (!field) return;

    field.type = field.type === "password" ? "text" : "password";
    button.textContent = field.type === "password" ? "Show" : "Hide";
  });
});

// document.querySelectorAll(".toggle-pass").forEach((button) => {
//   button.addEventListener("click", () => {
//     const target = button.dataset.target;
//     const field = document.querySelector(target);

//     if (!field) return;

//     field.type = field.type === "password" ? "text" : "password";
//     button.textContent = field.type === "password" ? "Show" : "Hide";
//   });
// });
