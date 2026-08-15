const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxriQkjiGf7D47MaPCBPzKeUuZ-zdFn1jW8w2UhvgcjxI1HUcEmpvGfA07VhWgWaXrYfg/exec";


document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("rsvpForm");
  const guestCountSection = document.getElementById("guestCountSection");
  const adultsInput = document.getElementById("adults");
  const childrenInput = document.getElementById("children");
  const formMessage = document.getElementById("formMessage");
  const submitButton = form.querySelector(".submit-button");

  const rsvpRadios =
    document.querySelectorAll('input[name="rsvp"]');


  /* =====================================================
     HIDE GUEST COUNT INITIALLY
  ===================================================== */

  guestCountSection.style.display = "none";


  /* =====================================================
     YES / NO SELECTION
  ===================================================== */

  rsvpRadios.forEach((radio) => {

    radio.addEventListener("change", () => {

      if (radio.value === "yes") {

        guestCountSection.style.display = "grid";

        adultsInput.value = "1";
        childrenInput.value = "0";

      }

      if (radio.value === "no") {

        guestCountSection.style.display = "none";

        adultsInput.value = "0";
        childrenInput.value = "0";

      }

    });

  });


  /* =====================================================
     FORM SUBMISSION
  ===================================================== */

  form.addEventListener("submit", async (event) => {

    event.preventDefault();


    /* ---------------------------------------------
       NAME
    ---------------------------------------------- */

    const guestName =
      document
        .getElementById("guestName")
        .value
        .trim();


    /* ---------------------------------------------
       RSVP
    ---------------------------------------------- */

    const selected =
      document.querySelector(
        'input[name="rsvp"]:checked'
      );


    if (!guestName) {

      formMessage.textContent =
        "Please enter your name.";

      return;

    }


    if (!selected) {

      formMessage.textContent =
        "Please select Yes or No.";

      return;

    }


    const rsvp =
      selected.value.toLowerCase();


    /* ---------------------------------------------
       GUEST COUNT

       IMPORTANT:
       NO = 0 / 0
       YES = selected counts
    ---------------------------------------------- */

    let adults = 0;
    let children = 0;


    if (rsvp === "yes") {

      adults =
        parseInt(adultsInput.value, 10);

      children =
        parseInt(childrenInput.value, 10);


      if (!adults || adults < 1) {

        adults = 1;

      }


      if (isNaN(children) || children < 0) {

        children = 0;

      }

    }


    /* ---------------------------------------------
       OTHER FIELDS
    ---------------------------------------------- */

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


    /* ---------------------------------------------
       DATA
    ---------------------------------------------- */

    const data = {

      guestName: guestName,

      rsvp: rsvp,

      adults: adults,

      children: children,

      phone: phone,

      message: message

    };


    console.log(
      "RSVP DATA:",
      JSON.stringify(data)
    );


    /* ---------------------------------------------
       BUTTON
    ---------------------------------------------- */

    submitButton.disabled = true;

    submitButton.innerHTML = `
      <span>SENDING...</span>
      <b>...</b>
    `;


    formMessage.textContent =
      "Sending your RSVP...";


    /* ---------------------------------------------
       GOOGLE SHEETS
    ---------------------------------------------- */

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

          body:
            JSON.stringify(data)
        }
      );


      /* -------------------------------------------
         SUCCESS
      -------------------------------------------- */

      formMessage.textContent =
        rsvp === "yes"
          ? "Thank you! We can't wait to celebrate with you. ♥"
          : "Thank you for letting us know. We will miss you! ♥";


      /* Reset */

      form.reset();


      adultsInput.value = "1";
      childrenInput.value = "0";


      guestCountSection.style.display =
        "none";


      submitButton.disabled = false;


      submitButton.innerHTML = `
        <span>RSVP RECEIVED</span>
        <b>✓</b>
      `;


      setTimeout(() => {

        submitButton.innerHTML = `
          <span>SEND RSVP</span>
          <b>→</b>
        `;

      }, 3000);


    } catch (error) {

      console.error(
        "RSVP ERROR:",
        error
      );


      formMessage.textContent =
        "Unable to submit RSVP. Please try again.";


      submitButton.disabled = false;


      submitButton.innerHTML = `
        <span>SEND RSVP</span>
        <b>→</b>
      `;

    }

  });

});
