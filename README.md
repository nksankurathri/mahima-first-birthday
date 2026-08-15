# Mahima Sankurathri – First Birthday RSVP Website

A mobile-friendly butterfly-themed invitation website inspired by the shared housewarming invitation.

## Event details

- Mahima Sankurathri's First Birthday
- Sunday, September 6th, 2026
- 12:30 PM
- William L. Patena Community Center
- 8335 W Jefferson St, Peoria, AZ 85345

## Files

- `index.html` – invitation and RSVP page
- `styles.css` – pastel butterfly/floral styling and responsive layout
- `script.js` – RSVP behavior and Google Form connection point

## Important: connect RSVP responses

The website is static, so it needs a form service to store guest responses.

### Easiest option: Google Forms

1. Create a Google Form with:
   - Name
   - Attending (Yes / No)
   - Adults
   - Children
   - Children's Names
   - Phone Number
   - Message
2. Link the responses to a Google Sheet.
3. Copy the published Google Form URL.
4. Open `script.js` and set:
   `const RSVP_FORM_URL = "YOUR_GOOGLE_FORM_URL";`
5. Upload the three website files to GitHub Pages.

### Recommended improvement

For the cleanest experience, the RSVP form can be embedded directly into the page instead of opening Google Forms. Another option is a Google Apps Script endpoint that lets the custom RSVP form submit directly into Google Sheets while keeping the butterfly design.

## Publish with GitHub Pages

1. Create a GitHub repository, for example `mahima-birthday`.
2. Upload `index.html`, `styles.css`, and `script.js`.
3. In GitHub: Settings → Pages → Deploy from branch → `main` → `/root`.
4. Your invitation can then be shared as a normal website link.

## Customization

The colors, wording, fonts, buttons, and RSVP fields are all in the included files and can be changed without a framework.
