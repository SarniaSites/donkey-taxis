# Donkey Taxis — website

Single-page site for Donkey Taxis (Guernsey): plain HTML, Tailwind CSS v3 (compiled and committed) and a little vanilla JS. No frameworks, no CDNs, all paths relative.

```
index.html              the site (sections split by comment banners)
thanks.html             shown after the booking form is sent
404.html                page not found (uses a <base> tag, see Going live)
assets/css/styles.css   compiled Tailwind (do not edit by hand)
assets/js/main.js       header, menu, split-flap board, services explorer, form, footer car
assets/js/pages.js      board + car on thanks/404
assets/fonts/           self-hosted fonts + OFL licences
images/brand/logo.webp  the logo, cut out from the Facebook profile picture
images/work/            photos (name.webp ~1600px + name-sm.webp ~800px)
images/                 favicons, og-image.jpg (1200x630), site.webmanifest
src/input.css           Tailwind source, @font-face, components, keyframes
tailwind.config.js      brand colours (by role, with sources) + fonts
sitemap.xml, robots.txt
_fb-pack/               the Facebook source pack (not published: underscore folder)
_shots/                 screenshots for the team (not published)
```

## Brand

| Name | Hex | Used for |
|---|---|---|
| action | `#c81e28` | Call, quote and link colour only (logo red `#fe3841`, deepened for contrast) |
| brand.red / shade | `#fe3841` / `#d1262c` | the drawn car (from the logo) |
| highlight | `#fddd41` | board remarks, lit tiles, markers (logo tail light) |
| board | `#2a2e33` | departures board, tours band, footer (banner charcoal / number plate) |
| ink | `#1c2025` | text (banner blue-grey taken to near-black) |
| surface / paper / silver | `#edf0f3` / `#f8f9fa` / `#b9c2cc` | grounds and lines (the silver paintwork) |

Fonts: **Google Sans Flex** (display, ROND axis at 100 to echo the rounded lettering on the logo car; subset to weight/width/roundness) and **Rethink Sans** (body). Both OFL, licences in `assets/fonts/`.
Logo: the original Facebook image (1101px) was cut out to a transparent WebP, not redrawn. The small line-art car used in the ticket and footer is a simplified drawing of the logo car (`#car` symbol in `index.html`).

## Editing

- **Text**: edit `index.html`.
- **Colours**: `tailwind.config.js`, then `npm install && npm run build`.
- **Services explorer**: each service is one `<button data-tab="…">` row in the board plus one `<div data-panel="…">` with the same key. Copy both to add a service, and add it to the form's `<select>`.
- **Hero board words**: `data-words` and `data-remarks` on the `[data-flap]` element (max 11 letters a word).
- **Tour places**: the `<li class="place">` rows in the Island tours section.
- **Adding a photo**: save `name.webp` (~1600px) and `name-sm.webp` (~800px) in `images/work/` and use `srcset` like the existing images.
- No gallery or before/after: the pack has one real photo of the driver and car. Ask the client for photos of tours and pick-ups and add a gallery when they arrive.

## Going live — checklist

- [ ] Client buys their domain in their own name (roughly £10 a year for .com, £30–40 for .gg)
- [ ] Help the client create a free Cloudflare account in their name; connect this repo to Cloudflare Pages on their account (production branch `main`, no build command, output = repo root) and add their domain to the Pages project
- [ ] Swap the GitHub Pages URL for the real domain everywhere: canonical, og tags, JSON-LD, sitemap, `_next`, and the `<base>` tag in `404.html`
- [ ] Switch the form from the team's email to the client's (`donkeytaxis@gmail.com`?) and activate FormSubmit
- [ ] Confirm phone/email; get the client to sign off the services wording
- [ ] Assumptions to check with the client:
  - Departures as well as arrivals for airport transfers; pick-ups from hotels; cliff-path drop-off/collect; "kept smart, on time" wording (from a review)
  - Tour stops (Petit Bot, La Vallette, St Peter Port, cliff paths) come from their own posts about the island; confirm they're happy to name them
  - The driver's name isn't in the pack (a boat-sale post mentions Martin on 07781 104646; not used). If they share it, the Call buttons can say "Call <name>"
- [ ] Left out of the pack: the Christmas Day flyer (it lists a different email, 1stcalltaxisgsy@gmail.com: check), the boat for sale, shared Visit Guernsey / events / food posts and their photos (not the client's own), the old business.site link, review counts
- [ ] Optional: transfer the repo to the client's own GitHub if they want it

Source: built from the Facebook pack in `_fb-pack/` (not published on the live site).
