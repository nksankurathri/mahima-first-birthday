const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxriQkjiGf7D47MaPCBPzKeUuZ-zdFn1jW8w2UhvgcjxI1HUcEmpvGfA07VhWgWaXrYfg/exec";


document.addEventListener("DOMContentLoaded", function () {

  /* =====================================================
     ELEMENTS
  ===================================================== */

  const form =
    document.getElementById("rsvpForm");

  const guestCountSection =
    document.getElementById("guestCountSection");

  const adultsInput =
    document.getElementById("adults");

  const childrenInput =
    document.getElementById("children");

  const formMessage =
    document.getElementById("formMessage");

  const submitButton =
    form.querySelector(".submit-button");

  const rsvpOptions =
    document.querySelectorAll(
      'input[name="rsvp"]'
    );


  /* =====================================================
     INITIAL STATE
  ===================================================== */

  guestCountSection.style.display = "none";

  adultsInput.value = "1";
  childrenInput.value = "0";


  /* =====================================================
     YES / NO
  ===================================================== */

  rsvpOptions.forEach(function (radio) {

    radio.addEventListener("change", function () {

      if (this.value === "yes") {

        /* YES */

        guestCountSection.style.display = "grid";

        adultsInput.value = "1";

        childrenInput.value = "0";

      } else {

        /* NO */

        guestCountSection.style.display = "none";

        adultsInput.value = "0";

        childrenInput.value = "0";

      }

    });

  });


  /* =====================================================
     FORM SUBMIT
  ===================================================== */

  form.addEventListener("submit", async function (event) {

    event.preventDefault();


    const guestName =
      document
        .getElementById("guestName")
        .value
        .trim();


    const selectedRSVP =
      document.querySelector(
        'input[name="rsvp"]:checked'
      );


    if (!guestName) {

      formMessage.textContent =
        "Please enter your name.";

      return;

    }


    if (!selectedRSVP) {

      formMessage.textContent =
        "Please select Yes or No.";

      return;

    }


    const rsvp =
      selectedRSVP.value;


    let adults = 0;
    let children = 0;


    if (rsvp === "yes") {

      adults =
        Number(adultsInput.value) || 1;

      children =
        Number(childrenInput.value) || 0;

    }


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
      data
    );


    /* =================================================
       BUTTON
    ================================================= */

    submitButton.disabled = true;

    submitButton.innerHTML = `
      <span>SENDING...</span>
      <b>...</b>
    `;


    formMessage.textContent =
      "Sending your RSVP...";


    /* =================================================
       GOOGLE SHEETS
    ================================================= */

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


      /* ===============================================
         SUCCESS
      =============================================== */

      formMessage.textContent =
        "Thank you! Your RSVP has been received. ♥";


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


      setTimeout(function () {

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
        "Something went wrong. Please try again.";


      submitButton.disabled = false;

      submitButton.innerHTML = `
        <span>SEND RSVP</span>
        <b>→</b>
      `;

    }

  });

});
