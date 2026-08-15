/*
  RSVP setup:
  1. Create a Google Form with these fields:
     Name, Attending, Adults, Children, Children's Names, Phone Number, Message
  2. Publish/share the form.
  3. Put the Google Form URL in RSVP_FORM_URL below.
  4. For a more seamless embedded experience, replace the RSVP form section
     with the Google Form embed code, or connect a Google Apps Script endpoint.
*/

const RSVP_FORM_URL = ""; // Example: "https://docs.google.com/forms/d/e/XXXXXXXX/viewform"

const form = document.getElementById("rsvpForm");
const guestFields = document.getElementById("guestFields");
const status = document.getElementById("formStatus");
const attendingInputs = document.querySelectorAll('input[name="attending"]');

attendingInputs.forEach(input => {
  input.addEventListener("change", () => {
    const attending = document.querySelector('input[name="attending"]:checked')?.value;
    guestFields.classList.toggle("hidden", attending !== "Yes");
    document.getElementById("adults").required = attending === "Yes";
    document.getElementById("children").required = attending === "Yes";
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (RSVP_FORM_URL) {
    const data = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) params.append(key, value);
    window.open(`${RSVP_FORM_URL}?${params.toString()}`, "_blank");
    status.textContent = "Your RSVP form is opening in a new tab. Thank you! 🦋";
    form.reset();
    guestFields.classList.add("hidden");
    return;
  }

  status.textContent = "RSVP form is ready. Connect your Google Form or Google Apps Script endpoint in script.js to start collecting responses.";
  status.style.color = "#7d4b9a";
});
