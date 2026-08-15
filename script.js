/* =========================================================
   GOOGLE APPS SCRIPT WEB APP
========================================================= */

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxriQkjiGf7D47MaPCBPzKeUuZ-zdFn1jW8w2UhvgcjxI1HUcEmpvGfA07VhWgWaXrYfg/exec";


/* =========================================================
   COUNTDOWN
========================================================= */

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


/*
   IMPORTANT:
   HTML uses guestCountSection.
   The old script incorrectly used guestNumbers.
*/

const guestCountSection =
  document.getElementById(
    "guestCountSection"
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


/*
   IMPORTANT:
   Guest count must be hidden when
   the page first loads.
*/

if (guestCountSection) {

  guestCountSection.style.display =
    "none";

}


/*
   Listen for YES / NO selection
*/

rsvpOptions.forEach(
  option => {

    option.addEventListener(
      "change",
      function () {


        /* ---------------------------------------
           YES selected
        --------------------------------------- */

        if (
          this.value === "yes"
        ) {

          /*
             Show Adults + Children
          */

          guestCountSection.style.display =
            "grid";


          /*
             Default Adults = 1
          */

          adultsSelect.value =
            "1";


          /*
             Default Children = 0
          */

          childrenSelect.value =
            "0";


        }


        /* ---------------------------------------
           NO selected
        --------------------------------------- */

        else {

          /*
             Hide Adults + Children
          */

          guestCountSection.style.display =
            "none";


          /*
             Don't count guests
             when they cannot attend.
          */

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
   RSVP SUBMISSION
========================================================= */

rsvpForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    /* ---------------------------------------
       Values
    --------------------------------------- */

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
      document
        .getElementById("adults")
        .value;


    const children =
      document
        .getElementById("children")
        .value;


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


    /* ---------------------------------------
       Validation
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
       Disable button
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
       Data
    --------------------------------------- */

    const data = {

      guestName:
        guestName,

      rsvp:
        rsvp,

      /*
         YES:
         use selected counts

         NO:
         always send 0
      */

      adults:
        rsvp === "yes"
          ? Number(adults) || 1
          : 0,

      children:
        rsvp === "yes"
          ? Number(children) || 0
          : 0,

      phone:
        phone,

      message:
        message

    };


    /* ---------------------------------------
       Google Apps Script
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


      /* ---------------------------------------
         Success
      --------------------------------------- */

      formMessage.textContent =
        "Thank you! Your RSVP has been received. ♥";


      formMessage.style.color =
        "#754957";


      /* ---------------------------------------
         Reset form
      --------------------------------------- */

      rsvpForm.reset();


      /*
         Restore guest count defaults
      */

      adultsSelect.value =
        "1";


      childrenSelect.value =
        "0";


      /*
         IMPORTANT:
         Hide guest count after submission.
      */

      guestCountSection.style.display =
        "none";


      /* ---------------------------------------
         Button
      --------------------------------------- */

      submitButton.disabled =
        false;


      submitButton.innerHTML =
        `
          <span>RSVP RECEIVED</span>
          <b>✓</b>
        `;


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
