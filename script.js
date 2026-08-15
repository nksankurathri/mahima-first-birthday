// ==========================================
// GOOGLE APPS SCRIPT WEB APP URL
// ==========================================

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxriQkjiGf7D47MaPCBPzKeUuZ-zdFn1jW8w2UhvgcjxI1HUcEmpvGfA07VhWgWaXrYfg/exec";


// ==========================================
// COUNTDOWN
// ==========================================

const eventDate = new Date(
  "September 6, 2026 12:30:00"
).getTime();

function updateCountdown() {

  const now = new Date().getTime();

  const distance = eventDate - now;

  if (distance <= 0) {

    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";

    return;
  }

  const days = Math.floor(
    distance / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) /
    (1000 * 60 * 60)
  );

  const minutes = Math.floor(
    (distance % (1000 * 60 * 60)) /
    (1000 * 60)
  );

  const seconds = Math.floor(
    (distance % (1000 * 60)) /
    1000
  );

  document.getElementById("days").textContent =
    String(days).padStart(2, "0");

  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");
}

updateCountdown();

setInterval(updateCountdown, 1000);


// ==========================================
// RSVP FORM
// ==========================================

const rsvpForm =
  document.getElementById("rsvpForm");

const guestNumbers =
  document.getElementById("guestNumbers");

const submitButton =
  document.getElementById("submitButton");

const formMessage =
  document.getElementById("formMessage");


// Show / hide adult & children fields

const rsvpOptions =
  document.querySelectorAll(
    'input[name="rsvp"]'
  );

rsvpOptions.forEach(option => {

  option.addEventListener("change", function () {

    if (this.value === "Yes") {

      guestNumbers.style.display = "grid";

    } else {

      guestNumbers.style.display = "none";

    }

  });

});


// ==========================================
// SUBMIT RSVP
// ==========================================

rsvpForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();

    const guestName =
      document.getElementById("guestName").value.trim();

    const rsvp =
      document.querySelector(
        'input[name="rsvp"]:checked'
      )?.value;

    const adults =
      document.getElementById("adults").value;

    const children =
      document.getElementById("children").value;

    const phone =
      document.getElementById("phone").value.trim();

    const message =
      document.getElementById("message").value.trim();


    if (!guestName || !rsvp) {

      formMessage.textContent =
        "Please complete the required fields.";

      return;
    }


    submitButton.disabled = true;

    submitButton.textContent =
      "SENDING...";

    formMessage.textContent = "";


    const data = {

      guestName: guestName,

      rsvp: rsvp,

      adults:
        rsvp === "Yes"
          ? Number(adults)
          : 0,

      children:
        rsvp === "Yes"
          ? Number(children)
          : 0,

      phone: phone,

      message: message

    };


    try {

      await fetch(
        GOOGLE_SCRIPT_URL,
        {
          method: "POST",

          mode: "no-cors",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body: JSON.stringify(data)
        }
      );


      formMessage.textContent =
        "Thank you! Your RSVP has been received. 💕";

      formMessage.style.color =
        "#8e5968";


      rsvpForm.reset();

      guestNumbers.style.display =
        "grid";


      submitButton.textContent =
        "RSVP RECEIVED";


    } catch (error) {

      console.error(error);

      formMessage.textContent =
        "Something went wrong. Please try again.";

      formMessage.style.color =
        "#a65d68";

      submitButton.disabled = false;

      submitButton.textContent =
        "SEND RSVP";

    }

  }
);
