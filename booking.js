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

        openBookingPopup(roomName);
    });
    });
}

let bookingPopup;

function openBookingPopup(roomName) {
    if (!bookingPopup) {
    bookingPopup = document.createElement("dialog");
    bookingPopup.className = "booking-popup";
    bookingPopup.innerHTML =
        '<button class="booking-popup-close" type="button" aria-label="Close booking popup">&times;</button>' +
        "<h2>Booking this Room</h2>" +
        '<p class="booking-popup-room"></p>';
    document.body.appendChild(bookingPopup);

    // 3.3: name + e-mail, checked on submit
    const bookingForm = document.createElement("form");
    bookingForm.className = "booking-form";
    bookingForm.noValidate = true;

    const submitButton = document.createElement("button");
    submitButton.className = "btn btn-primary";
    submitButton.type = "submit";
    submitButton.textContent = "Submit booking";

    bookingForm.append(createContactFields(), submitButton);
    bookingPopup.appendChild(bookingForm);

    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!validateContactDetails(bookingForm)) {
            return;
        }
        // 3.5: send the booking to the API here
    });

    const closeButton = bookingPopup.querySelector(".booking-popup-close");
    closeButton.addEventListener("click", function () {
        if (typeof bookingPopup.close === "function") {
        bookingPopup.close();
        } 
        else {
        bookingPopup.removeAttribute("open");
        }
    });

    bookingPopup.addEventListener("click", function (event) {
        if (event.target === bookingPopup) {
            if (typeof bookingPopup.close === "function") {
                bookingPopup.close();
            } 
            else {
                bookingPopup.removeAttribute("open");
                }
        }
    });
    }

    bookingPopup.querySelector(".booking-popup-room").textContent =
    "Book " + roomName;

    if (typeof bookingPopup.showModal === "function") {
    bookingPopup.showModal();
    } else {
    bookingPopup.setAttribute("open", "");
    }
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