# Pier Capitan Resto Bar & Grill — piercapitan.com

A fast, mobile-first, one-page website for Pier Capitan Resto Bar & Grill, Ormoc City.
It is plain HTML, CSS and JavaScript with no build step, so it runs on any static host
(GitHub Pages, Netlify, Cloudflare Pages, Hostinger, cPanel and others).

## Homepage sections

| Section | What's there |
|---|---|
| Hero | Logo, headline, buttons for the menu and the Mobile Bar, quick-info strip |
| **About Us** | Story, location, three feature highlights |
| **Promotions** | Free Taste Test (100 pax & up), Beer Packages from ₱8,000, Celebrations |
| **Menu** | Tabs: From the Grill · Pulutan · Rice & Mains · Drinks (the real cocktail/mocktail list) |
| **Mobile Bar** | Unlimited packages with a guest-count price switcher (50–200 pax), Beer packages, Add-ons price list, inclusions/notes, booking inquiry form |
| **Gallery** | Photo grid with a full-screen lightbox (keyboard and swipe-friendly buttons) |
| Visit | Address, phones, email, hours, Google Map, directions |

The site also has a sticky header, a mobile menu, a mobile quick-action bar (Call / Menu / Book), SEO and social-sharing
tags, Google business data (schema.org) and an accessible layout (keyboard tabs, focus styles, alt text).

## ⚠️ Items to confirm with the client before launch

1. **Food menu**: the Grill, Pulutan and Rice & Mains dishes in `index.html` are **sample dishes**.
   Replace them with the real menu (prices can be added). Drinks and all Mobile Bar prices come from the
   client's *Mobile Bar Package* PDF.
2. **Opening hours**: currently "Open daily — call ahead". Add the real hours in the *Visit* section.
3. **Facebook link**: points to a Facebook search. Replace it with the page's actual URL.
4. **Map pin**: the map searches "Superdome, Ormoc City". Swap in the exact Google Maps embed for the stall if available.
5. **Booking form**: opens the visitor's email app with a pre-filled message to `inquiry@piercapitan.com`.
   To receive submissions without email apps, connect a form service (Formspree, Netlify Forms, etc.).
6. **More photos**: add food and dining-area photos to `assets/img/` and to the gallery list.

## Files

```
index.html            the homepage
assets/css/styles.css styles (brand colors are at the top in :root)
assets/js/main.js     tabs, price switcher, booking form, lightbox, mobile nav
assets/img/           photos (taken from the Mobile Bar PDF), logos, favicon
CNAME                 custom domain for GitHub Pages (piercapitan.com)
```

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Deploy to piercapitan.com (GitHub Pages)

1. In the GitHub repo go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose the branch
   `claude/serene-cerf-mfyn4b` (or `main` if it is renamed) and the folder `/ (root)`, then **Save**.
3. Under **Custom domain**, enter `piercapitan.com` and **Save** (the `CNAME` file already contains it).
4. At the domain registrar, set these DNS records:

   | Type | Host | Value |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | zmh7t85srm-dev.github.io |

5. When the DNS check passes (minutes to a few hours), tick **Enforce HTTPS**.

Until the domain is connected, the site is at `https://zmh7t85srm-dev.github.io/pier-capitan/`.
Free GitHub accounts can only publish Pages from **public** repositories.
`.nojekyll` tells GitHub to serve the files as they are, without running Jekyll.
