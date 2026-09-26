# Bansal International School — Landing Page

Static one-page website for **Bansal International School**, Kalali, Vadodara
(by P. N. Group of Education). Built to match the "BIS WEBSITE" design artboard.

## What's in here

```
index.html                  the whole page
404.html                    not-found page (self-contained, no assets)
robots.txt / sitemap.xml    search-engine plumbing
.nojekyll                   stops GitHub Pages running the site through Jekyll
assets/css/style.css        all styling (single stylesheet)
assets/js/main.js           scroll reveal + the school film
assets/fonts/               Playfair Display, self-hosted (woff2)
assets/img/                 logo, hero photo, campus art, favicon
deploy/                     nginx config + server deploy script
```

No build step, no dependencies — plain HTML/CSS/JS.

## Page sections

1. **Header** — Bansal International School logo
2. **Hero** — "A New Landmark in Learning · Coming Soon in Kalali"
3. **Vision / video** — the school film, below the hero
4. **Mission** — our mission statement + campus sketch
5. **Values** — the eight "We Foster" qualities
6. **Footer** — admissions & careers phone numbers, location

## The video

`assets/js/main.js` holds the video configuration at the top:

```js
const SITE = {
  videoUrl: "https://www.youtube-nocookie.com/embed/lIr4FbOtliw",
  videoPoster: "assets/img/school-render.jpg"
};
```

Clicking the **Play School Video** card under the hero swaps the poster for the
real player **in place** — no popup, no modal, nothing to get out of sync. It
uses YouTube's privacy-enhanced host, so no cookies are set until playback
starts. A "Watch it on YouTube" link sits under the card as a fallback for
networks that block embeds.

To change the film, replace `videoUrl` with any YouTube/Vimeo **embed** URL. A
self-hosted `.mp4` path also works — the player detects the file type.

## Going live on your own domain

The page carries absolute URLs for link previews, structured data and the
sitemap. When you move to your own domain, update these four files:

| File | What to change |
|---|---|
| `index.html` | `og:url`, `og:image`, and the two `url`/`logo`/`image` values in the JSON-LD block |
| `robots.txt` | the `Sitemap:` line |
| `sitemap.xml` | the `<loc>` value |
| `deploy/nginx.conf` | `server_name` |

Then add a `CNAME` file containing just your domain if you're staying on GitHub
Pages.

## Run it locally

```bash
cd site
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

### 1. Push to GitHub (private repo)

```bash
cd site
git init -b main
git add .
git commit -m "Bansal International School landing page"
gh repo create bansal-international-school --private --source=. --remote=origin --push
```

Without the GitHub CLI: create the private repo in the browser, then

```bash
git remote add origin git@github.com:<your-username>/bansal-international-school.git
git push -u origin main
```

### 2. Put it on a server

On a fresh Ubuntu/Debian server:

```bash
sudo apt update && sudo apt install -y nginx git
sudo mkdir -p /var/www/bansal-international-school
sudo git clone https://github.com/<your-username>/bansal-international-school.git \
  /var/www/bansal-international-school
sudo cp /var/www/bansal-international-school/deploy/nginx.conf \
  /etc/nginx/sites-available/bansal-international-school
sudo ln -sf /etc/nginx/sites-available/bansal-international-school /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Point your domain's A record at the server IP, then add HTTPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 3. Later updates

Copy `deploy/deploy.sh` to the server once, then just run it after pushing:

```bash
ssh user@your-server 'sudo bash /var/www/bansal-international-school/deploy/deploy.sh'
```

It pulls the latest `main`, fixes permissions and reloads nginx.

## Updating content

Text lives directly in `index.html`. The eight value cards are the `<li class="value">`
items inside `<ul class="values__grid">` — each has an icon `<svg>`, an `<h3 class="value__label">`
and a `<p class="value__text">`.
