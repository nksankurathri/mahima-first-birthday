/* =========================================================
   GOOGLE APPS SCRIPT WEB APP
========================================================= */

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxriQkjiGf7D47MaPCBPzKeUuZ-zdFn1jW8w2UhvgcjxI1HUcEmpvGfA07VhWgWaXrYfg/exec";


/* =========================================================
   COUNTDOWN
========================================================= */

/*
   September 6, 2026
   12:30 PM

   Month is 0-based in JavaScript:
   January = 0
   September = 8
*/

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


  const difference =
    eventDate.getTime() -
    now.getTime();


  if (difference <= 0) {

    setCountdownValue(
      "days",
      0
    );

    setCountdownValue(
      "hours",
      0
    );

    setCountdownValue(
      "minutes",
      0
    );

    setCountdownValue(
      "seconds",
      0
    );

    return;

  }


  const days =
    Math.floor(
      difference /
      (1000 * 60 * 60 * 24)
    );


  const hours =
    Math.floor(
      (
        difference %
        (1000 * 60 * 60 * 24)
      ) /
      (1000 * 60 * 60)
    );


  const minutes =
    Math.floor(
      (
        difference %
        (1000 * 60 * 60)
      ) /
      (1000 * 60)
    );


  const seconds =
    Math.floor(
      (
        difference %
        (1000 * 60)
      ) /
      1000
    );


  setCountdownValue(
    "days",
    days
  );


  setCountdownValue(
    "hours",
    hours
  );


  setCountdownValue(
    "minutes",
    minutes
  );


  setCountdownValue(
    "seconds",
    seconds
  );

}


function setCountdownValue(
  id,
  value
) {


  const element =
    document.getElementById(id);


  if (!element) {
    return;
  }


  element.textContent =
    String(value).padStart(
      2,
      "0"
    );

}


updateCountdown();


setInterval(
  updateCountdown,
  1000
);


/* =========================================================
   RSVP ELEMENTS
========================================================= */

const rsvpForm =
  document.getElementById(
    "rsvpForm"
  );


const guestNumbers =
  document.getElementById(
    "guestNumbers"
  );


const submitButton =
  document.getElementById(
    "submitButton"
  );


const formMessage =
  document.getElementById(
    "formMessage"
  );


const adultsSelect =
  document.getElementById(
    "adults"
  );


const childrenSelect =
  document.getElementById(
    "children"
  );


/* =========================================================
   RSVP YES / NO
========================================================= */

const rsvpOptions =
  document.querySelectorAll(
    'input[name="rsvp"]'
  );


rsvpOptions.forEach(
  option => {


    option.addEventListener(
      "change",
      function () {


        if (
          this.value === "Yes"
        ) {


          /*
             When YES is selected,
             default adults to 1.
          */

          guestNumbers.style.display =
            "grid";


          adultsSelect.value =
            "1";


        } else {


          /*
             When NO is selected,
             guest count is hidden.
          */

          guestNumbers.style.display =
            "none";


          adultsSelect.value =
            "0";


          childrenSelect.value =
            "0";

        }

      }
    );

  }
);


/* =========================================================
   RSVP FORM SUBMISSION
========================================================= */

rsvpForm.addEventListener(
  "submit",
  async function (event) {


    event.preventDefault();


    /* ---------------------------------------
       Get form values
    --------------------------------------- */

    const guestName =
      document
        .getElementById(
          "guestName"
        )
        .value
        .trim();


    const rsvp =
      document.querySelector(
        'input[name="rsvp"]:checked'
      )?.value;


    const adults =
      document
        .getElementById(
          "adults"
        )
        .value;


    const children =
      document
        .getElementById(
          "children"
        )
        .value;


    const phone =
      document
        .getElementById(
          "phone"
        )
        .value
        .trim();


    const message =
      document
        .getElementById(
          "message"
        )
        .value
        .trim();


    /* ---------------------------------------
       Validate
    --------------------------------------- */

    if (
      !guestName ||
      !rsvp
    ) {


      formMessage.textContent =
        "Please complete the required fields.";


      return;

    }


    /* ---------------------------------------
       Disable submit button
    --------------------------------------- */

    submitButton.disabled =
      true;


    submitButton.innerHTML =
      `
        <span>SENDING...</span>
        <b>...</b>
      `;


    formMessage.textContent =
      "";


    /* ---------------------------------------
       Build data
    --------------------------------------- */

    const data = {


      guestName:
        guestName,


      rsvp:
        rsvp,


      adults:
        rsvp === "Yes"
          ? Number(adults)
          : 0,


      children:
        rsvp === "Yes"
          ? Number(children)
          : 0,


      phone:
        phone,


      message:
        message

    };


    /* ---------------------------------------
       Send to Google Apps Script
    --------------------------------------- */

    try {


      await fetch(
        GOOGLE_SCRIPT_URL,
        {

          method:
            "POST",

          mode:
            "no-cors",

          headers: {

            "Content-Type":
              "text/plain;charset=utf-8"

          },

          body:
            JSON.stringify(data)

        }
      );


      /*
         no-cors does not allow the browser
         to read the Apps Script response.

         However, the request is still sent
         to the Google Apps Script endpoint.
      */


      /* ---------------------------------------
         Success message
      --------------------------------------- */

      formMessage.textContent =
        "Thank you! Your RSVP has been received. ♥";


      formMessage.style.color =
        "#754957";


      /* Reset form */

      rsvpForm.reset();


      /*
         Restore default values
      */

      adultsSelect.value =
        "1";


      childrenSelect.value =
        "0";


      guestNumbers.style.display =
        "grid";


      /* ---------------------------------------
         Update button
      --------------------------------------- */

      submitButton.disabled =
        false;


      submitButton.innerHTML =
        `
          <span>RSVP RECEIVED</span>
          <b>✓</b>
        `;


      /*
         Return button to normal
      */

      setTimeout(
        () => {


          submitButton.innerHTML =
            `
              <span>SEND RSVP</span>
              <b>→</b>
            `;

        },
        3500
      );


    } catch (error) {


      console.error(
        "RSVP Error:",
        error
      );


      /* ---------------------------------------
         Error message
      --------------------------------------- */

      formMessage.textContent =
        "Something went wrong. Please try again.";


      formMessage.style.color =
        "#a34e5d";


      submitButton.disabled =
        false;


      submitButton.innerHTML =
        `
          <span>SEND RSVP</span>
          <b>→</b>
        `;

    }

  }
);
