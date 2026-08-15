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

  /*
     IMPORTANT:
     Disable guest count when RSVP is not selected.
  */

  adultsInput.disabled = true;
  childrenInput.disabled = true;


  /* =====================================================
     YES RSVP
  ===================================================== */

  yesRadio.addEventListener(
    "change",
    function () {

      if (!yesRadio.checked) {
        return;
      }


      /*
         Show guest count
      */

      guestCountSection.style.display =
        "grid";


      /*
         Enable inputs
      */

      adultsInput.disabled = false;

      childrenInput.disabled = false;


      /*
         Default values
      */

      adultsInput.value = "1";

      childrenInput.value = "0";

    }
  );


  /* =====================================================
     NO RSVP
  ===================================================== */

  noRadio.addEventListener(
    "change",
    function () {

      if (!noRadio.checked) {
        return;
      }


      /*
         Hide guest count
      */

      guestCountSection.style.display =
        "none";


      /*
         IMPORTANT:
         Disable the inputs.

         This prevents browser validation
         from checking min="1" on Adults.
      */

      adultsInput.disabled = true;

      childrenInput.disabled = true;


      /*
         Values are still zero internally.
      */

      adultsInput.value = "0";

      childrenInput.value = "0";

    }
  );


  /* =====================================================
     FORM SUBMIT
  ===================================================== */

  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      /* -----------------------------------------------
         Guest Name
      ------------------------------------------------ */

      const guestName =
        document
          .getElementById("guestName")
          .value
          .trim();


      if (!guestName) {

        formMessage.textContent =
          "Please enter your name.";

        document
          .getElementById("guestName")
          .focus();

        return;

      }


      /* -----------------------------------------------
         Determine RSVP
      ------------------------------------------------ */

      let rsvp = "";


      if (yesRadio.checked) {

        rsvp = "yes";

      }
      else if (noRadio.checked) {

        rsvp = "no";

      }


      if (!rsvp) {

        formMessage.textContent =
          "Please select Yes or No.";

        return;

      }


      /* -----------------------------------------------
         Guest Count
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
         NO = always zero guests
      */

      if (rsvp === "no") {

        adults = 0;

        children = 0;

      }


      /* -----------------------------------------------
         Phone
      ------------------------------------------------ */

      const phone =
        document
          .getElementById("phone")
          .value
          .trim();


      /* -----------------------------------------------
         Message
      ------------------------------------------------ */

      const message =
        document
          .getElementById("message")
          .value
          .trim();


      /* -----------------------------------------------
         Data
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
        "Submitting RSVP:",
        data
      );


      /* -----------------------------------------------
         Button
      ------------------------------------------------ */

      submitButton.disabled = true;

      submitButton.innerHTML = `
        <span>SENDING...</span>
        <b>...</b>
      `;


      formMessage.textContent =
        "Sending your RSVP...";


      /* -----------------------------------------------
         Submit to Google Apps Script
      ------------------------------------------------ */

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

        if (rsvp === "yes") {

          formMessage.textContent =
            "Thank you! We can't wait to celebrate with you. ♥";

        }
        else {

          formMessage.textContent =
            "Thank you for letting us know. We will miss you! ♥";

        }


        /* -------------------------------------------
           Reset
        -------------------------------------------- */

        form.reset();


        /*
           After reset, restore defaults.
        */

        adultsInput.value = "1";

        childrenInput.value = "0";


        /*
           Disable again because
           no RSVP is selected.
        */

        adultsInput.disabled = true;

        childrenInput.disabled = true;


        guestCountSection.style.display =
          "none";


        /* -------------------------------------------
           Button
        -------------------------------------------- */

        submitButton.disabled = false;

        submitButton.innerHTML = `
          <span>RSVP RECEIVED</span>
          <b>✓</b>
        `;


        setTimeout(
          function () {

            submitButton.innerHTML = `
              <span>SEND RSVP</span>
              <b>→</b>
            `;

          },
          3000
        );


      }
      catch (error) {

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

    }
  );

});
