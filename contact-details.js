// 3.3: Booking step 2, name + e-mail with validation

function createContactFields() {
    const fields = document.createDocumentFragment();
    fields.append(
        createField("booking-name", "name", "Name", "text", "name"),
        createField("booking-email", "email", "E-mail", "email", "email")
    );
    return fields;
}

function createField(id, name, labelText, type, autocomplete) {
    const wrapper = document.createElement("div");
    wrapper.className = "contact-field";

    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;

    const input = document.createElement("input");
    input.id = id;
    input.name = name;
    input.type = type;
    input.autocomplete = autocomplete;
    input.required = true;

    wrapper.append(label, input);
    return wrapper;
}

// returns true if both fields are ok, otherwise shows the errors
function validateContactDetails(form) {
    const nameInput = form.elements.name;
    const emailInput = form.elements.email;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const nameOk = name !== "";
    const emailOk = emailPattern.test(email);

    showFieldError(nameInput, nameOk ? "" : "Please write your name.");
    showFieldError(emailInput, emailOk ? "" : "Please write a valid e-mail address.");

    if (!nameOk) {
        nameInput.focus();
    } else if (!emailOk) {
        emailInput.focus();
    }

    return nameOk && emailOk;
}

// error text right under the input, empty message removes it
function showFieldError(input, message) {
    let error = input.nextElementSibling;

    if (!error || !error.classList.contains("field-error")) {
        error = document.createElement("p");
        error.className = "field-error";
        error.id = `${input.id}-error`;
        input.insertAdjacentElement("afterend", error);
        input.setAttribute("aria-describedby", error.id);
    }

    error.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
}

// remove the error when the user starts typing again
document.addEventListener("input", function (event) {
    const input = event.target;
    if (input.getAttribute && input.getAttribute("aria-invalid") === "true") {
        showFieldError(input, "");
    }
});
