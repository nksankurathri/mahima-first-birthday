const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxriQkjiGf7D47MaPCBPzKeUuZ-zdFn1jW8w2UhvgcjxI1HUcEmpvGfA07VhWgWaXrYfg/exec";


document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("rsvpForm");

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


  /* =====================================================
     RSVP RADIO BUTTONS
  ===================================================== */

  const yesRadio =
    document.querySelector(
      'input[name="rsvp"][value="yes"]'
    );

  const noRadio =
    document.querySelector(
      'input[name="rsvp"][value="no"]'
    );


  /* =====================================================
     INITIAL STATE
  ===================================================== */

  guestCountSection.style.display = "none";

  adultsInput.value = "1";
  childrenInput.value = "0";


  /* =====================================================
     YES
  ===================================================== */

  yesRadio.addEventListener("change", function () {

    if (!yesRadio.checked) {
      return;
    }

    guestCountSection.style.display = "grid";

    adultsInput.value = "1";
    childrenInput.value = "0";

  });


  /* =====================================================
     NO
  ===================================================== */

  noRadio.addEventListener("change", function () {

    if (!noRadio.checked) {
      return;
    }

    guestCountSection.style.display = "none";

    adultsInput.value = "0";
    childrenInput.value = "0";

  });


  /* =====================================================
     SUBMIT
  ===================================================== */

  form.addEventListener("submit", function (event) {

    event.preventDefault();


    /* -----------------------------------------------
       NAME
    ------------------------------------------------ */

    const guestName =
      document
        .getElementById("guestName")
        .value
        .trim();


    if (!guestName) {

      formMessage.textContent =
        "Please enter your name.";

      return;

    }


    /* -----------------------------------------------
       DETERMINE RSVP
       
       IMPORTANT:
       We explicitly check the radio buttons.
    ------------------------------------------------ */

    let rsvp = "";


    if (yesRadio.checked) {

      rsvp = "yes";

    }
    else if (noRadio.checked) {

      rsvp = "no";

    }


    if (rsvp === "") {

      formMessage.textContent =
        "Please select Yes or No.";

      return;

    }


    console.log(
      "SELECTED RSVP:",
      rsvp
    );


    /* -----------------------------------------------
       GUEST COUNT
    ------------------------------------------------ */

    let adults = 0;

    let children = 0;


    if (rsvp === "yes") {

      adults =
        parseInt(
          adultsInput.value,
          10
        ) || 1;


      children =
        parseInt(
          childrenInput.value,
          10
        ) || 0;

    }


    /*
       NO ALWAYS = 0 / 0
    */


    if (rsvp === "no") {

      adults = 0;

      children = 0;

    }


    /* -----------------------------------------------
       OTHER DATA
    ------------------------------------------------ */

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


    /* -----------------------------------------------
       CREATE DATA
    ------------------------------------------------ */

    const data = {

      guestName: guestName,

      rsvp: rsvp,

      adults: adults,

      children: children,

      phone: phone,

      message: message

    };


    console.log(
      "FINAL RSVP DATA:",
      data
    );


    /* -----------------------------------------------
       BUTTON
    ------------------------------------------------ */

    submitButton.disabled = true;


    submitButton.innerHTML = `
      <span>SENDING...</span>
      <b>...</b>
    `;


    formMessage.textContent =
      "Sending your RSVP...";


    /* -----------------------------------------------
       SEND TO GOOGLE SHEETS
    ------------------------------------------------ */

    fetch(
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
    )
    .then(function () {

      /*
         With no-cors we can't read the response,
         but the request was sent.
      */

      formMessage.textContent =
        rsvp === "yes"
          ? "Thank you! We can't wait to celebrate with you. ♥"
          : "Thank you for letting us know. We will miss you! ♥";


      form.reset();


      guestCountSection.style.display =
        "none";


      adultsInput.value =
        "1";

      childrenInput.value =
        "0";


      submitButton.disabled =
        false;


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

    })
    .catch(function (error) {

      console.error(
        "RSVP ERROR:",
        error
      );


      formMessage.textContent =
        "Unable to submit RSVP. Please try again.";


      submitButton.disabled =
        false;


      submitButton.innerHTML = `
        <span>SEND RSVP</span>
        <b>→</b>
      `;

    });

  });

});
