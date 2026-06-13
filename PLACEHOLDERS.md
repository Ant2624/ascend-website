# Placeholders to fill before launch

All site-wide variables live in `js/main.js` (top) and the spots marked `PLACEHOLDER` in `index.html`.

## Launch-blocking
1. **Female alumna quote** — replace the "Our next story could be yours" card in The Voices (`index.html`, search `PLACEHOLDER: alumna quote`). Get it from the alumni survey (see deliverables.md).
2. **48-hour response owner** — the site promises a reply within 48 hours. Someone must own the inbox before the form goes live.
3. **Formspree ID** — create a form at formspree.io, replace `FORMSPREE_ID_PLACEHOLDER` (2 places in `index.html`). Free tier works for testing; paid (~$10/mo) adds autoresponder.

## Before paid traffic
4. **Real retreat dates** — edit the `RETREATS` array and `NEXT_RETREAT_LABEL` at the top of `js/main.js`.

## Soon after launch
5. **Founder letter + name + photo** — edit the three paragraphs in The Letter section.
6. **Contact email** — replace `hello@ascendinfiniti.com` (footer + privacy.html).
7. **Refund policy** — confirm wording in `terms.html` and the FAQ answer.
8. **Outcome stat** — once the survey returns, a "[X]% would return" line can join the proof line.
9. **Plausible analytics** — uncomment the script tag in `index.html` head once the domain is live; events are already wired.
10. **Domain** — update the nominate/share mailto links (currently ascendinfiniti.com) if the domain differs.

## Asset upgrades (no action needed to launch)
- Desktop hero video: Higgsfield-generated loop (auto-swapped in at `assets/video/hero-desktop.mp4`).
- Testimonial captions: videos currently play with sound; add burned-in or WebVTT captions when transcribed.
- Press section: not present; add when real coverage exists.
