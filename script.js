const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxriQkjiGf7D47MaPCBPzKeUuZ-zdFn1jW8w2UhvgcjxI1HUcEmpvGfA07VhWgWaXrYfg/exec";


document.addEventListener("DOMContentLoaded", function () {

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

  adultsInput.disabled = true;
  childrenInput.disabled = true;

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

    adultsInput.disabled = false;
    childrenInput.disabled = false;

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

    adultsInput.disabled = true;
    childrenInput.disabled = true;

    adultsInput.value = "0";
    childrenInput.value = "0";

  });


  /* =====================================================
     SUBMIT
  ===================================================== */

  form.addEventListener("submit", async function (event) {

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
       RSVP
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


    /* =================================================
       IMPORTANT

       Send as URL-encoded form data instead of JSON.

       This works much more reliably with Google Apps
       Script Web Apps.
    ================================================= */

    const formData =
      new URLSearchParams();


    formData.append(
      "guestName",
      guestName
    );


    formData.append(
      "rsvp",
      rsvp
    );


    formData.append(
      "adults",
      String(adults)
    );


    formData.append(
      "children",
      String(children)
    );


    formData.append(
      "phone",
      phone
    );


    formData.append(
      "message",
      message
    );


    console.log(
      "RSVP DATA:",
      {
        guestName,
        rsvp,
        adults,
        children,
        phone,
        message
      }
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


    /* =================================================
       SEND
    ================================================= */

    try {

      await fetch(
        GOOGLE_SCRIPT_URL,
        {

          method: "POST",

          mode: "no-cors",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded;charset=UTF-8"
          },

          body:
            formData.toString()

        }
      );


      /* =================================================
         SUCCESS
      ================================================= */

      if (rsvp === "yes") {

        formMessage.textContent =
          "Thank you! We can't wait to celebrate with you. ♥";

      }
      else {

        formMessage.textContent =
          "Thank you for letting us know. We will miss you! ♥";

      }


      /* -----------------------------------------------
         Reset form
      ------------------------------------------------ */

      form.reset();


      guestCountSection.style.display =
        "none";


      adultsInput.disabled =
        true;

      childrenInput.disabled =
        true;


      adultsInput.value =
        "1";

      childrenInput.value =
        "0";


      /* -----------------------------------------------
         Button
      ------------------------------------------------ */

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


    }
    catch (error) {

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

    }

  });

});
