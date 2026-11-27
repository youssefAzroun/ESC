const BOOKING_API = "https://lernia-sjj-assignments.vercel.app/api/booking";

function attachBookRoomListeners() {
    document.querySelectorAll("a").forEach(function (link) {
    if (link.textContent.trim() !== "Book this room") {
        return;
    }

    if (link.dataset.bookRoomListenerAttached === "true") {
        return;
    }

    link.dataset.bookRoomListenerAttached = "true";
    link.addEventListener("click", function (event) {
        event.preventDefault();

        const card = link.closest(".challenge-card, .all-challenge-item");
        const roomHeading = card
        ? card.querySelector("h2, h3")
        : null;
        const roomName = roomHeading
        ? roomHeading.textContent.trim()
        : "this room";

        const challenge = {
            id: card ? Number(card.dataset.challengeId) : NaN,
            title: roomName,
            minParticipants: card ? Number(card.dataset.minParticipants) : 1,
            maxParticipants: card ? Number(card.dataset.maxParticipants) : 1,
        };

        openBookingPopup(challenge);
    });
    });
}

let bookingPopup;
let currentBooking = null;

function closeBookingPopup() {
    if (!bookingPopup) return;
    if (typeof bookingPopup.close === "function") {
        bookingPopup.close();
    } else {
        bookingPopup.removeAttribute("open");
    }
}

function setBookingStep(step) {
    if (!bookingPopup) return;
    bookingPopup.querySelectorAll("[data-booking-step]").forEach(function (panel) {
        panel.hidden = panel.dataset.bookingStep !== String(step);
    });
}

function openBookingPopup(challenge) {
    currentBooking = {
        id: challenge.id,
        title: challenge.title || "this room",
        minParticipants: challenge.minParticipants,
        maxParticipants: challenge.maxParticipants,
        date: "",
    };

    if (!bookingPopup) {
    bookingPopup = document.createElement("dialog");
    bookingPopup.className = "booking-popup";
    bookingPopup.innerHTML =
        '<button class="booking-popup-close" type="button" aria-label="Close booking popup">&times;</button>' +
        '<div data-booking-step="1" class="booking-step">' +
          '<h2 class="booking-step-title"></h2>' +
          '<form class="booking-form booking-form-step1">' +
            '<div class="contact-field">' +
              '<label for="booking-date">What date would you like to come?</label>' +
              '<input id="booking-date" name="date" type="date" required />' +
            '</div>' +
            '<p class="field-error" id="booking-date-error" hidden></p>' +
            '<button class="btn btn-primary" type="submit">Search available times</button>' +
          '</form>' +
        '</div>' +
        '<div data-booking-step="2" class="booking-step" hidden>' +
          '<h2 class="booking-step-title"></h2>' +
          '<form class="booking-form booking-form-step2" novalidate></form>' +
        '</div>' +
        '<div data-booking-step="3" class="booking-step booking-step-thanks" hidden>' +
          '<div class="booking-thanks-icon" aria-hidden="true">' +
            '<svg viewBox="0 0 48 48" width="56" height="56">' +
              '<circle cx="24" cy="24" r="22" fill="#eef2ff"/>' +
              '<path d="M14 24.5 21 31.5 34 17" fill="none" stroke="#6b46c1" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>' +
          '</div>' +
          '<h2 class="booking-thanks-title">Thank you!</h2>' +
          '<p class="booking-thanks-text">Your booking is confirmed. We look forward to seeing you.</p>' +
          '<button class="booking-back-link" type="button">Back to challenges</button>' +
        '</div>';
    document.body.appendChild(bookingPopup);

    // step 2 fields
    const step2Form = bookingPopup.querySelector(".booking-form-step2");
    const timeField = document.createElement("div");
    timeField.className = "contact-field";
    timeField.innerHTML =
        '<label for="booking-time">What time?</label>' +
        '<select id="booking-time" name="time" required></select>';

    const participantsField = document.createElement("div");
    participantsField.className = "contact-field";
    participantsField.innerHTML =
        '<label for="booking-participants">How many participants?</label>' +
        '<select id="booking-participants" name="participants" required></select>';

    const submitButton = document.createElement("button");
    submitButton.className = "btn btn-primary";
    submitButton.type = "submit";
    submitButton.textContent = "Submit booking";

    step2Form.append(
        createContactFields(),
        timeField,
        participantsField,
        submitButton
    );

    // step 1: pick a date and load free times
    bookingPopup.querySelector(".booking-form-step1").addEventListener("submit", async function (event) {
        event.preventDefault();
        const dateInput = bookingPopup.querySelector("#booking-date");
        const dateError = bookingPopup.querySelector("#booking-date-error");
        const date = dateInput.value;

        if (!date) {
            dateError.hidden = false;
            dateError.textContent = "Please choose a date.";
            return;
        }

        dateError.hidden = true;
        dateError.textContent = "";

        const searchButton = event.submitter || bookingPopup.querySelector(".booking-form-step1 button[type='submit']");
        searchButton.disabled = true;
        searchButton.textContent = "Searching…";

        try {
            const slots = await fetchAvailableTimes(currentBooking.id, date);
            currentBooking.date = date;
            populateTimeSelect(slots, bookingPopup.querySelector("#booking-time"));
            populateParticipantsSelect(
                currentBooking.minParticipants,
                currentBooking.maxParticipants,
                bookingPopup.querySelector("#booking-participants")
            );
            updateBookingTitles();
            setBookingStep(2);
        } catch (error) {
            console.error(error);
            dateError.hidden = false;
            dateError.textContent = "Could not load available times. Please try again.";
        } finally {
            searchButton.disabled = false;
            searchButton.textContent = "Search available times";
        }
    });

    // step 2 submit → post booking, then thank you
    step2Form.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (!validateContactDetails(step2Form)) {
            return;
        }

        const timeSelect = step2Form.querySelector("#booking-time");
        const participantsSelect = step2Form.querySelector("#booking-participants");

        if (!timeSelect.value) {
            return;
        }

        const payload = {
            challenge: currentBooking.id,
            name: step2Form.elements.name.value.trim(),
            email: step2Form.elements.email.value.trim(),
            date: currentBooking.date,
            time: timeSelect.value,
            participants: Number(participantsSelect.value),
        };

        const submitBtn = step2Form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting…";

        try {
            await submitBooking(payload);
            setBookingStep(3);
        } catch (error) {
            console.error(error);
            alert("Booking failed. Please try again.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit booking";
        }
    });

    const closeButton = bookingPopup.querySelector(".booking-popup-close");
    closeButton.addEventListener("click", closeBookingPopup);

    bookingPopup.querySelector(".booking-back-link").addEventListener("click", closeBookingPopup);

    bookingPopup.addEventListener("click", function (event) {
        if (event.target === bookingPopup) {
            closeBookingPopup();
        }
    });
    }

    // always start over when opening again
    const dateInput = bookingPopup.querySelector("#booking-date");
    if (dateInput) {
        dateInput.value = "";
    }
    const dateError = bookingPopup.querySelector("#booking-date-error");
    if (dateError) {
        dateError.hidden = true;
        dateError.textContent = "";
    }
    const step2FormReset = bookingPopup.querySelector(".booking-form-step2");
    if (step2FormReset) {
        step2FormReset.reset();
    }

    updateBookingTitles();
    setBookingStep(1);

    if (typeof bookingPopup.showModal === "function") {
    bookingPopup.showModal();
    } else {
    bookingPopup.setAttribute("open", "");
    }
}

function updateBookingTitles() {
    if (!bookingPopup || !currentBooking) return;
    const title = currentBooking.title.replace(/\s*\((online|on-site)\)\s*$/i, "");
    bookingPopup.querySelectorAll(".booking-step-title").forEach(function (heading, index) {
        heading.textContent = "Book room '" + title + "' (step " + (index + 1) + ")";
    });
}

async function fetchAvailableTimes(challengeId, date) {
    const url =
        BOOKING_API +
        "/available-times?date=" +
        encodeURIComponent(date) +
        "&challenge=" +
        encodeURIComponent(challengeId);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch available times");
    }

    const data = await response.json();
    return Array.isArray(data.slots) ? data.slots : [];
}

async function submitBooking(payload) {
    const response = await fetch(BOOKING_API + "/reservations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Failed to create reservation");
    }

    const data = await response.json();
    if (data.status !== "ok") {
        throw new Error("Booking was not accepted");
    }
    return data;
}

attachBookRoomListeners();

new MutationObserver(attachBookRoomListeners).observe(document.body, {
    childList: true,
    subtree: true,
});

function populateTimeSelect(availableTimes = [], selectEl = document.getElementById("booking-time")) {
    if (!selectEl) return;
    selectEl.innerHTML = "";

if (!Array.isArray(availableTimes) || availableTimes.length === 0) {
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "No available times";
    selectEl.appendChild(emptyOption);
    selectEl.disabled = true;
    return;
}

selectEl.disabled = false;

availableTimes.forEach(function (timeSlot) {
    const option = document.createElement("option");
    option.value = timeSlot;
    option.textContent = timeSlot;
    selectEl.appendChild(option);
});
}

function populateParticipantsSelect(minParticipants, maxParticipants, selectEl = document.getElementById("booking-participants")) {
    if (!selectEl) return;

    selectEl.innerHTML = "";

    const min = Number(minParticipants);
    const max = Number(maxParticipants);

    if (Number.isNaN(min) || Number.isNaN(max) || min > max) { 
        return
    }

    for (let count = min; count <= max; count++) {
        const option = document.createElement("option");
        option.value = String(count);
        option.textContent = count + (count === 1 ? " participant" : " participants");
        selectEl.appendChild(option);
  }
}
