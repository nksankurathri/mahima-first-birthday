/* =====================================================
   GOOGLE APPS SCRIPT
===================================================== */

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxriQkjiGf7D47MaPCBPzKeUuZ-zdFn1jW8w2UhvgcjxI1HUcEmpvGfA07VhWgWaXrYfg/exec";


/* =====================================================
   RSVP ELEMENTS
===================================================== */

const rsvpForm =
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
  rsvpForm
    ? rsvpForm.querySelector(".submit-button")
    : null;


/* =====================================================
   INITIAL STATE
===================================================== */

if (guestCountSection) {
  guestCountSection.style.display = "none";
}


/* =====================================================
   RSVP YES / NO
===================================================== */

const rsvpOptions =
  document.querySelectorAll(
    'input[name="rsvp"]'
  );


rsvpOptions.forEach(function (option) {

  option.addEventListener(
    "change",
    function () {

      /* -----------------------------------------------
         YES
      ------------------------------------------------ */

      if (this.value === "yes") {

        guestCountSection.style.display =
          "grid";


        /*
           Default adult count = 1
        */

        adultsInput.value = "1";


        /*
           Default children = 0
        */

        childrenInput.value = "0";

      }


      /* -----------------------------------------------
         NO
      ------------------------------------------------ */

      else {

        guestCountSection.style.display =
          "none";


        /*
           Don't count guests when
           they are not attending.
        */

        adultsInput.value = "0";

        childrenInput.value = "0";

      }

    }
  );

});


/* =====================================================
   RSVP FORM SUBMIT
===================================================== */

if (rsvpForm) {

  rsvpForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      /* -----------------------------------------------
         Get RSVP
      ------------------------------------------------ */

      const selectedRSVP =
        document.querySelector(
          'input[name="rsvp"]:checked'
        );


      if (!selectedRSVP) {

        formMessage.textContent =
          "Please select Yes or No.";

        return;

      }


      const rsvp =
        selectedRSVP.value;


      /* -----------------------------------------------
         Get guest name
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
         Guest count
      ------------------------------------------------ */

      let adults = 0;
      let children = 0;


      if (rsvp === "yes") {

        adults =
          Number(adultsInput.value) || 1;

        children =
          Number(childrenInput.value) || 0;

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
         Data for Google Sheets
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
         Disable button
      ------------------------------------------------ */

      if (submitButton) {

        submitButton.disabled = true;

        submitButton.innerHTML =
          `
            <span>SENDING...</span>
            <b>...</b>
          `;

      }


      formMessage.textContent =
        "Sending your RSVP...";


      /* -----------------------------------------------
         Send to Google Sheets
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


        /* ---------------------------------------------
           Success
        ---------------------------------------------- */

        formMessage.textContent =
          "Thank you! Your RSVP has been received. ♥";


        /*
           Reset form
        */

        rsvpForm.reset();


        /*
           Restore defaults
        */

        adultsInput.value = "1";

        childrenInput.value = "0";


        /*
           Hide guest count
        */

        guestCountSection.style.display =
          "none";


        /* ---------------------------------------------
           Restore button
        ---------------------------------------------- */

        if (submitButton) {

          submitButton.disabled = false;

          submitButton.innerHTML =
            `
              <span>RSVP RECEIVED</span>
              <b>✓</b>
            `;


          setTimeout(
            function () {

              submitButton.innerHTML =
                `
                  <span>SEND RSVP</span>
                  <b>→</b>
                `;

            },
            3000
          );

        }

      }


      /* -----------------------------------------------
         Error
      ------------------------------------------------ */

      catch (error) {

        console.error(
          "RSVP submission error:",
          error
        );


        formMessage.textContent =
          "Something went wrong. Please try again.";


        if (submitButton) {

          submitButton.disabled = false;

          submitButton.innerHTML =
            `
              <span>SEND RSVP</span>
              <b>→</b>
            `;

        }

      }

    }
  );

}
