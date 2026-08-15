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
     INITIAL STATE
  ===================================================== */

  guestCountSection.style.display = "none";

  adultsInput.value = "1";
  childrenInput.value = "0";


  /* =====================================================
     YES / NO
  ===================================================== */

  document
    .querySelectorAll('input[name="rsvp"]')
    .forEach(function (radio) {

      radio.addEventListener("change", function () {

        if (this.value === "yes") {

          guestCountSection.style.display = "grid";

          adultsInput.value = "1";
          childrenInput.value = "0";

        } else {

          guestCountSection.style.display = "none";

          adultsInput.value = "0";
          childrenInput.value = "0";

        }

      });

    });


  /* =====================================================
     FORM SUBMIT
  ===================================================== */

  form.addEventListener("submit", function (event) {

    event.preventDefault();


    const guestName =
      document
        .getElementById("guestName")
        .value
        .trim();


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


    let adults = "0";
    let children = "0";


    if (rsvp === "yes") {

      adults =
        adultsInput.value || "1";

      children =
        childrenInput.value || "0";

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


    /* =================================================
       CREATE HIDDEN IFRAME
    ================================================= */

    const iframe =
      document.createElement("iframe");

    iframe.name =
      "rsvp-submit-frame";

    iframe.style.display =
      "none";

    document.body.appendChild(iframe);


    /* =================================================
       CREATE TEMP FORM
    ================================================= */

    const submitForm =
      document.createElement("form");

    submitForm.method =
      "POST";

    submitForm.action =
      GOOGLE_SCRIPT_URL;

    submitForm.target =
      "rsvp-submit-frame";

    submitForm.style.display =
      "none";


    /* =================================================
       HELPER
    ================================================= */

    function addField(name, value) {

      const input =
        document.createElement("input");

      input.type = "hidden";

      input.name = name;

      input.value = value;

      submitForm.appendChild(input);

    }


    /* =================================================
       SEND DATA
    ================================================= */

    addField(
      "guestName",
      guestName
    );

    addField(
      "rsvp",
      rsvp
    );

    addField(
      "adults",
      adults
    );

    addField(
      "children",
      children
    );

    addField(
      "phone",
      phone
    );

    addField(
      "message",
      message
    );


    document.body.appendChild(
      submitForm
    );


    /* =================================================
       UI
    ================================================= */

    submitButton.disabled =
      true;

    submitButton.innerHTML = `
      <span>SENDING...</span>
      <b>...</b>
    `;


    formMessage.textContent =
      "Sending your RSVP...";


    /* =================================================
       SUBMIT
    ================================================= */

    submitForm.submit();


    /* =================================================
       SHOW SUCCESS
       
       Google Apps Script receives the
       request through the iframe.
    ================================================= */

    setTimeout(function () {

      formMessage.textContent =
        rsvp === "yes"
          ? "Thank you! We can't wait to celebrate with you. ♥"
          : "Thank you for letting us know. We will miss you! ♥";


      form.reset();


      adultsInput.value =
        "1";

      childrenInput.value =
        "0";


      guestCountSection.style.display =
        "none";


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


      /*
         Remove temporary elements
      */

      submitForm.remove();

      iframe.remove();

    }, 1200);

  });

});
