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

    return {
      ok: response.ok,
      data: await readJsonSafe(response),
    };
  } catch {
    return {
      ok: false,
      data: { message: "Unable to reach server." },
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
  if (!formEl) return;
  const error = $(errorEl) || {
    textContent: "",
    classList: { add: () => {}, remove: () => {} },
  };

  const inputs = Object.fromEntries(
    Object.entries(fields).map(([key, selector]) => [
      key,
      formEl.querySelector(selector),
    ]),
  );

  const getValues = () =>
    Object.fromEntries(
      Object.entries(inputs).map(([k, el]) => [k, el?.value.trim() || ""]),
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
    if (!input) return;
    input.addEventListener("input", validateForm);
  });

  let activeInput = null;

  Object.values(inputs).forEach((input) => {
    if (!input) return;

    input.addEventListener("focus", () => {
      activeInput = input;
    });
  });

  formEl.addEventListener("focusout", (e) => {
    if (!activeInput) return;

    const currentGroup = activeInput.closest(".form-group");
    if (currentGroup?.contains(e.target)) return;

    clearError(error);
    activeInput = null;
  });

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const button = formEl.querySelector("button[type='submit']");
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = "Processing...";

    const result = await sendRequest(endpoint, getValues());

    button.disabled = false;

    if (!result.ok) {
      button.textContent = "Try Again";
    }

    if (result.ok) {
      button.textContent = "Success!";

      setTimeout(() => {
        document.location.replace("/");
      }, 300);
      return;
    }

    showError(error, result.data?.message || "Request failed");

    inputs.password?.focus();
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
    if (!isValidEmail(email)) return "Please enter a valid email address";
    if (!password) return "Please enter your password";
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
    if (name.length < 3) return "Username must be at least 3 characters";
    if (!isValidEmail(email)) return "Please enter a valid email";
    if (password.length < 6) return "Password must be at least 6 characters";
  },
});

// Password Toggle
$$(".toggle-pass").forEach((button) => {
  button.addEventListener("click", () => {
    const field = $(button.dataset.target);
    if (!field) return;

    field.type = field.type === "password" ? "text" : "password";
    button.textContent = field.type === "password" ? "Show" : "Hide";
  });
});
