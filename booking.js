document.addEventListener("DomContentLoaded", function() {

    const bookingDate = document.getElementById("bookingDate");
    const continueBooking = document.getElementById("continueBooking");
    const bookingError = document.getElementById("bookingError");

    continueBooking.addEventListener("click", async function() {
        const selectedDate = bookingDate.value;
        if (!selectedDate) {
            bookingError.textContent = "Please select a date";
            return;
        }
        bookingError.textContent ="";
    });
});