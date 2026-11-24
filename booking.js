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