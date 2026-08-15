/* =====================================================
   GOOGLE APPS SCRIPT
===================================================== */

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxriQkjiGf7D47MaPCBPzKeUuZ-zdFn1jW8w2UhvgcjxI1HUcEmpvGfA07VhWgWaXrYfg/exec";


/* =====================================================
   RSVP ELEMENTS
===================================================== */

const form =
  document.getElementById("rsvpForm");

const guestFields =
  document.getElementById("guestFields");

const status =
  document.getElementById("formStatus");

const attendingInputs =
  document.querySelectorAll(
    'input[name="attending"]'
  );

const adultsInput =
  document.getElementById("adults");

const childrenInput =
  document.getElementById("children");


/* =====================================================
   SHOW / HIDE ADULT + CHILDREN
===================================================== */

function updateGuestFields() {

  const selected =
    document.querySelector(
      'input[name="attending"]:checked'
    );


  /*
     Nothing selected
  */

  if (!selected) {

    guestFields.classList.add(
      "hidden"
    );

    adultsInput.required = false;

    childrenInput.required = false;

    return;

  }


  /*
     YES
  */

  if (
    selected.value === "Yes"
  ) {

    guestFields.classList.remove(
      "hidden"
    );


    /*
       Default adults to 1
    */

    if (
      !adultsInput.value ||
      Number(adultsInput.value) < 1
    ) {

      adultsInput.value = "1";

    }


    adultsInput.required = true;

    childrenInput.required = true;

  }


  /*
     NO
  */

  else {

    guestFields.classList.add(
      "hidden"
    );


    /*
       Do not count guests
       when RSVP is No.
    */

    adultsInput.value = "0";

    childrenInput.value = "0";


    adultsInput.required = false;

    childrenInput.required = false;

  }

}


/* =====================================================
   RSVP RADIO BUTTONS
===================================================== */

attendingInputs.forEach(
  function (input) {

    input.addEventListener(
      "change",
      updateGuestFields
    );

  }
);


/* =====================================================
   INITIAL STATE
===================================================== */

updateGuestFields();


/* =====================================================
   COUNTDOWN
===================================================== */

const eventDate =
  new Date(
    "September 6, 2026 12:30:00"
  ).getTime();


function updateCountdown() {

  const now =
    new Date().getTime();


  const difference =
    eventDate - now;


  if (
    difference <= 0
  ) {

    document.getElementById(
      "days"
    ).textContent = "00";

    document.getElementById(
      "hours"
    ).textContent = "00";

    document.getElementById(
      "minutes"
    ).textContent = "00";

    document.getElementById(
      "seconds"
    ).textContent = "00";

    return;

  }


  const days =
    Math.floor(
      difference /
      (
        1000 *
        60 *
        60 *
        24
      )
    );


  const hours =
    Math.floor(
      (
        difference %
        (
          1000 *
          60 *
          60 *
          24
        )
      ) /
      (
        1000 *
        60 *
        60
      )
    );


  const minutes =
    Math.floor(
      (
        difference %
        (
          1000 *
          60 *
          60
        )
      ) /
      (
        1000 *
        60
      )
    );


  const seconds =
    Math.floor(
      (
        difference %
        (
          1000 *
          60
        )
      ) /
      1000
    );


  document.getElementById(
    "days"
  ).textContent =
    String(days).padStart(
      2,
      "0"
    );


  document.getElementById(
    "hours"
  ).textContent =
    String(hours).padStart(
      2,
      "0"
    );


  document.getElementById(
    "minutes"
  ).textContent =
    String(minutes).padStart(
      2,
      "0"
    );


  document.getElementById(
    "seconds"
  ).textContent =
    String(seconds).padStart(
      2,
      "0"
    );

}


updateCountdown();


setInterval(
  updateCountdown,
  1000
);


/* =====================================================
   RSVP SUBMISSION
===================================================== */

form.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    const selected =
      document.querySelector(
        'input[name="attending"]:checked'
      );


    if (!selected) {

      status.textContent =
        "Please select Yes or No.";

      return;

    }


    const attending =
      selected.value;


    const guestName =
      document
        .getElementById("name")
        .value
        .trim();


    /*
       YES = use guest counts
       NO = zero guests
    */

    let adults = 0;

    let children = 0;


    if (
      attending === "Yes"
    ) {

      adults =
        Number(
          adultsInput.value
        ) || 1;


      children =
        Number(
          childrenInput.value
        ) || 0;

    }


    const childNames =
      document
        .getElementById(
          "childNames"
        )
        .value
        .trim();


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


    /*
       Total Guests is calculated
       by Google Apps Script.
    */

    const data = {

      guestName:
        guestName,

      rsvp:
        attending,

      adults:
        adults,

      children:
        children,

      phone:
        phone,

      message:
        childNames
          ? `Children: ${childNames}${message ? " | " + message : ""}`
          : message

    };


    console.log(
      "Submitting RSVP:",
      data
    );


    const submitButton =
      form.querySelector(
        ".submit-btn"
      );


    submitButton.disabled = true;

    submitButton.style.opacity =
      "0.65";


    status.textContent =
      "Sending your RSVP...";


    try {


      /*
         Google Apps Script accepts
         this POST request.

         no-cors is intentional for
         GitHub Pages -> Apps Script.
      */

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
         Request has been sent.
      */

      status.textContent =
        "Thank you! Your RSVP has been received. 🦋";


      status.style.color =
        "#7d4b9a";


      /*
         Reset form
      */

      form.reset();


      /*
         Reset defaults
      */

      adultsInput.value =
        "1";

      childrenInput.value =
        "0";


      /*
         Hide guest fields
      */

      guestFields.classList.add(
        "hidden"
      );


      adultsInput.required =
        false;

      childrenInput.required =
        false;


    }

    catch (error) {


      console.error(
        "RSVP Error:",
        error
      );


      status.textContent =
        "Something went wrong. Please try again.";


      status.style.color =
        "#b33a5c";

    }


    submitButton.disabled =
      false;

    submitButton.style.opacity =
      "1";

  }
);
