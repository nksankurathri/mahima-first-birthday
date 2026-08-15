/* ==========================================
   GOOGLE APPS SCRIPT
========================================== */

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxriQkjiGf7D47MaPCBPzKeUuZ-zdFn1jW8w2UhvgcjxI1HUcEmpvGfA07VhWgWaXrYfg/exec";


/* ==========================================
   COUNTDOWN
========================================== */

const eventDate = new Date(
  2026,
  8,
  6,
  12,
  30,
  0
);


function updateCountdown() {

  const now = new Date();

  let difference =
    eventDate.getTime() - now.getTime();


  if (difference <= 0) {

    setCountdownValue("days", 0);
    setCountdownValue("hours", 0);
    setCountdownValue("minutes", 0);
    setCountdownValue("seconds", 0);

    return;
  }


  const days =
    Math.floor(
      difference /
      (1000 * 60 * 60 * 24)
    );


  const hours =
    Math.floor(
      (difference %
        (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );


  const minutes =
    Math.floor(
      (difference %
        (1000 * 60 * 60)) /
        (1000 * 60)
    );


  const seconds =
    Math.floor(
      (difference %
        (1000 * 60)) /
        1000
    );


  setCountdownValue("days", days);
  setCountdownValue("hours", hours);
  setCountdownValue("minutes", minutes);
  setCountdownValue("seconds", seconds);
}


function setCountdownValue(id, value) {

  const element =
    document.getElementById(id);

  if (!element) return;

  element.textContent =
    String(value).padStart(2, "0");
}


updateCountdown();

setInterval(
  updateCountdown,
  1000
);


/* ==========================================
   RSVP
========================================== */

const rsvpForm =
  document.getElementById("rsvpForm");

const guestNumbers =
  document.getElementById("guestNumbers");

const submitButton =
  document.getElementById("submitButton");

const formMessage =
  document.getElementById("formMessage");


/* ==========================================
   SHOW / HIDE GUEST COUNT
========================================== */

const rsvpOptions =
  document.querySelectorAll(
    'input[name="rsvp"]'
  );


rsvpOptions.forEach(option => {

  option.addEventListener(
    "change",
    function () {

      if (this.value === "Yes") {

        guestNumbers.style.display =
          "grid";

      } else {

        guestNumbers.style.display =
          "none";

      }

    }
  );

});


/* ==========================================
   RSVP SUBMISSION
========================================== */

rsvpForm.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();


    const guestName =
      document
        .getElementById("guestName")
        .value
        .trim();


    const rsvp =
      document.querySelector(
        'input[name="rsvp"]:checked'
      )?.value;


    const adults =
      document.getElementById(
        "adults"
      ).value;


    const children =
      document.getElementById(
        "children"
      ).value;


    const phone =
      document
        .getElementById("phone")
        .value
        .trim();


    const message =
      document
        .getElementById("message")
        .value
        .trim();


    if (!guestName || !rsvp) {

      formMessage.textContent =
        "Please complete the required fields.";

      return;
    }


    submitButton.disabled = true;

    submitButton.innerHTML =
      "<span>SENDING...</span><b>...</b>";


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
        "Thank you! Your RSVP has been received. ♥";


      formMessage.style.color =
        "#754957";


      rsvpForm.reset();


      guestNumbers.style.display =
        "grid";


      submitButton.disabled =
        false;


      submitButton.innerHTML =
        "<span>RSVP RECEIVED</span><b>✓</b>";


      setTimeout(() => {

        submitButton.innerHTML =
          "<span>SEND RSVP</span><b>→</b>";

      }, 3500);


    } catch (error) {

      console.error(
        "RSVP Error:",
        error
      );


      formMessage.textContent =
        "Something went wrong. Please try again.";


      formMessage.style.color =
        "#a34e5d";


      submitButton.disabled =
        false;


      submitButton.innerHTML =
        "<span>SEND RSVP</span><b>→</b>";

    }

  }
);
