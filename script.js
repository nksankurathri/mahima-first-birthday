const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxriQkjiGf7D47MaPCBPzKeUuZ-zdFn1jW8w2UhvgcjxI1HUcEmpvGfA07VhWgWaXrYfg/exec";


/* =====================================================
   ELEMENTS
===================================================== */

const form =
  document.getElementById("rsvpForm");


const formMessage =
  document.getElementById("formMessage");


const guestCountSection =
  document.getElementById(
    "guestCountSection"
  );


const adultsInput =
  document.getElementById("adults");


const childrenInput =
  document.getElementById("children");


/* =====================================================
   SHOW / HIDE ADULT + CHILDREN
===================================================== */

function updateGuestCountVisibility() {


  const selected =
    document.querySelector(
      'input[name="rsvp"]:checked'
    );


  /*
     Nothing selected
  */

  if (!selected) {

    guestCountSection.classList.remove(
      "show"
    );

    return;

  }


  /*
     YES
  */

  if (selected.value === "yes") {


    guestCountSection.classList.add(
      "show"
    );


    /*
       Default adult count = 1
    */

    if (
      !adultsInput.value ||
      Number(adultsInput.value) < 1
    ) {

      adultsInput.value = "1";

    }


    return;

  }


  /*
     NO
  */

  guestCountSection.classList.remove(
    "show"
  );


  /*
     Set counts to zero
     so they won't be counted.
  */

  adultsInput.value = "0";

  childrenInput.value = "0";

}


/* =====================================================
   RSVP RADIO EVENTS
===================================================== */

const rsvpRadios =
  document.querySelectorAll(
    'input[name="rsvp"]'
  );


rsvpRadios.forEach(
  function (radio) {

    radio.addEventListener(
      "change",
      updateGuestCountVisibility
    );

  }
);


/* =====================================================
   INITIAL STATE
===================================================== */

updateGuestCountVisibility();


/* =====================================================
   FORM SUBMIT
===================================================== */

form.addEventListener(
  "submit",
  async function (event) {


    event.preventDefault();


    /* -----------------------------------------------
       Guest name
    ------------------------------------------------ */

    const guestName =
      document
        .getElementById("guestName")
        .value
        .trim();


    /* -----------------------------------------------
       RSVP
    ------------------------------------------------ */

    const selected =
      document.querySelector(
        'input[name="rsvp"]:checked'
      );


    if (!selected) {

      formMessage.textContent =
        "Please select Yes or No.";

      return;

    }


    const rsvp =
      selected.value;


    /* -----------------------------------------------
       Guest counts
    ------------------------------------------------ */

    let adults = 0;

    let children = 0;


    /*
       Only count guests if attending.
    */

    if (rsvp === "yes") {


      adults =
        Number(
          adultsInput.value
        ) || 1;


      children =
        Number(
          childrenInput.value
        ) || 0;

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
       Data sent to Google Sheets
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
      "RSVP Data:",
      data
    );


    /* -----------------------------------------------
       Button
    ------------------------------------------------ */

    const submitButton =
      form.querySelector(
        ".submit-button"
      );


    submitButton.disabled = true;

    submitButton.style.opacity = "0.6";


    formMessage.textContent =
      "Sending your RSVP...";


    /* -----------------------------------------------
       SEND TO GOOGLE APPS SCRIPT
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


      /*
         Google Apps Script request
         has been sent.
      */

      formMessage.textContent =
        "Thank you! Your RSVP has been received. 💕";


      /* ---------------------------------------------
         Reset form
      ---------------------------------------------- */

      form.reset();


      adultsInput.value = "1";

      childrenInput.value = "0";


      /*
         Hide guest count after reset
      */

      guestCountSection.classList.remove(
        "show"
      );


    }

    catch (error) {


      console.error(
        "RSVP submission error:",
        error
      );


      formMessage.textContent =
        "Something went wrong. Please try again.";


    }


    submitButton.disabled = false;

    submitButton.style.opacity = "1";


  }
);
