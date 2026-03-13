// DOM Helpers
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Validation Helpers
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// UI Helpers
const showError = (element, message) => {
  element.textContent = message;
  element.classList.add("show");
};

const clearError = (element) => {
  element.textContent = "";
  element.classList.remove("show");
};

// Network Helpers
const readJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const sendRequest = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const data = await readJsonSafe(response);
    return { ok: response.ok, data };
  } catch {
    return {
      ok: false,
      data: { message: "Unable to reach server. Try again." },
    };
  }
};

// Generic Form Controller
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
      Object.entries(inputs).map(([key, el]) => [key, el.value.trim()]),
    );

  const validateForm = () => {
    const values = getValues();
    const message = validate(values);

    if (message) {
      showError(error, message);
      return false;
    }

    clearError(error);
    return true;
  };

  Object.values(inputs).forEach((input) => {
    input.addEventListener("input", validateForm);
  });

  formEl.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const submitBtn = formEl.querySelector("button[type='submit']");
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = "Processing...";

    const result = await sendRequest(endpoint, getValues());

    submitBtn.disabled = false;
    submitBtn.textContent = originalText;

    if (result.ok) {
      document.location.replace("/");
      return;
    }

    showError(error, result.data?.message || "Request failed.");

    if (inputs.password) {
      inputs.password.value = "";
      inputs.password.focus();
    }
  });
};

// Login Form Setup
createFormController({
  form: "#loginForm",
  fields: {
    email: "#loginName",
    password: "#loginPassword",
  },
  errorEl: "#loginError",
  endpoint: "/api/user/login",
  validate: ({ email, password }) => {
    if (!isValidEmail(email)) return "Please enter a valid email address.";
    if (!password) return "Please enter your password.";
  },
});

// Signup Form Setup
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
    if (name.length < 3) return "Username must be at least 3 characters long.";
    if (!isValidEmail(email)) return "Please enter a valid email address.";
    if (password.length < 8)
      return "Password must be at least 8 characters long.";
  },
});

// Password Toggle
$$(".toggle-pass").forEach((button) => {
  button.addEventListener("click", () => {
    const targetSelector = button.dataset.target;
    const field = $(targetSelector);
    if (!field) return;

    field.type = field.type === "password" ? "text" : "password";
    button.textContent = field.type === "password" ? "Show" : "Hide";
  });
});
