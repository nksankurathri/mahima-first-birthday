const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxriQkjiGf7D47MaPCBPzKeUuZ-zdFn1jW8w2UhvgcjxI1HUcEmpvGfA07VhWgWaXrYfg/exec";


const form = document.getElementById("rsvpForm");
const formMessage = document.getElementById("formMessage");

const guestCountSection =
  document.getElementById("guestCountSection");

const adultsInput =
  document.getElementById("adults");

const childrenInput =
  document.getElementById("children");



/* =====================================================
   RSVP YES / NO
===================================================== */

const rsvpOptions =
  document.querySelectorAll(
    'input[name="rsvp"]'
  );


rsvpOptions.forEach(option => {

  option.addEventListener("change", function () {

    if (this.value === "yes") {

      // Show guest count
      guestCountSection.style.display = "grid";

      // Default adults to 1
      if (
        !adultsInput.value ||
        Number(adultsInput.value) < 1
      ) {
        adultsInput.value = 1;
      }

    }

    else if (this.value === "no") {

      // Hide guest count
      guestCountSection.style.display = "none";

      // Reset guest counts
      adultsInput.value = 0;
      childrenInput.value = 0;

    }

  });

});



/* =====================================================
   INITIAL STATE
===================================================== */

guestCountSection.style.display = "none";



/* =====================================================
   SUBMIT RSVP
===================================================== */

form.addEventListener("submit", async function (event) {

  event.preventDefault();


  const guestName =
    document.getElementById("guestName").value.trim();


  const rsvp =
    document.querySelector(
      'input[name="rsvp"]:checked'
    )?.value;


  const phone =
    document.getElementById("phone").value.trim();


  const message =
    document.getElementById("message").value.trim();


  let adults = 0;

  let children = 0;


  /*
    Only collect guest counts
    when RSVP is YES.
  */

  if (rsvp === "yes") {

    adults =
      Number(adultsInput.value) || 1;

    children =
      Number(childrenInput.value) || 0;

  }


  const data = {

    guestName: guestName,

    rsvp: rsvp,

    adults: adults,

    children: children,

    phone: phone,

    message: message

  };


  /* Disable button */

  const submitButton =
    form.querySelector(
      ".submit-button"
    );


  submitButton.disabled = true;

  submitButton.style.opacity = "0.6";


  formMessage.textContent =
    "Sending your RSVP...";


  try {

    const response =
      await fetch(
        GOOGLE_SCRIPT_URL,
        {
          method: "POST",

          mode: "no-cors",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body:
            JSON.stringify(data)
        }
      );


    /*
      With no-cors we cannot read the
      response, but the request is sent
      successfully to Google Apps Script.
    */

    formMessage.textContent =
      "Thank you! Your RSVP has been received. 💕";


    form.reset();


    // Reset guest counts
    adultsInput.value = 1;

    childrenInput.value = 0;


    // Hide guest count again
    guestCountSection.style.display =
      "none";


  }

  catch (error) {

    console.error(error);


    formMessage.textContent =
      "Something went wrong. Please try again.";

  }


  submitButton.disabled = false;

  submitButton.style.opacity = "1";

});
