# Portfolio snapshot — August 13, 2026

**What this is:** A freeze of the iPod Classic portfolio *before* major redesign work.  
**Live site:** [joellim.co](https://joellim.co)  
**Repo:** `joellimn/Portfolio` · branch `master`  
**Git restore points:** tag `snapshot-2026-08-13-pre-major` · branch `snapshot/2026-08-13-pre-major`  
**Code export:** `mp3-design-portfolio-source.zip` (same folder as this file)

---

## One-sentence pitch

Joel Lim’s UX portfolio is an interactive **iPod Classic**: Menu on the glass, scroll/tap into Cover Flow “Works,” open case studies, and an About screen — all framed as hardware chrome that zooms into a full-bleed stage.

---

## How someone moves through it

| Step | What you see | How you get there |
|------|----------------|-------------------|
| **1. Menu (home)** | Purple iPod on white. LCD shows name, tagline, “Scroll / Tap to view works.” Stickers on the body. Click wheel visible. | `/` |
| **2. Works** | Device zooms until the LCD fills the viewport. Cover Flow of project “albums.” | Desktop: scroll down. Mobile: tap the LCD (or center wheel). URL → `/works` |
| **3. Case study** | Full-screen reading view with banner hero + block content. | Center cover / select. URL → `/works/{id}` |
| **4. About** | Bio + photo, contact footer. | End of Cover Flow, or Navigation → About. URL → `/about` |

**Navigation drawer** (Menu button / status-bar back when titled “Works”): Works, About, Email (copy), LinkedIn, Resume.

---

## Projects in Cover Flow (left → right)

1. **160th SOAR** — dashboard / research (`soar`) · cover video reveal  
2. **UMG** — internship (`umg`) · still cover  
3. **Wearitt** — design system (`wearitt`) · still PNG reveal  
4. **WTTIN** — travel app (`wttin`) · cover video reveal  

Case studies with `heroBanner` use a traditional banner hero (not album-art “Now Playing”). Content lives as typed blocks in `src/data/projects.ts`.

---

## Desktop vs mobile

| | Desktop | Phone / tablet |
|--|---------|----------------|
| Enter Works | Scroll wheel on Menu | Tap full LCD (same as center button) |
| Cover Flow | Vertical drag / scroll | Horizontal swipe |
| Lighting | Mouse hover sheen on metal + glass (Menu at rest only) | No sheen (coarse pointer) |
| About return | Scroll up at top | Swipe down at top |
| Copy | “Scroll to view works” | “Tap to view works” |

Touch detection (`useIsTouchScreen`): hybrid laptops with fine pointer + hover stay on the desktop model even if they report touch points.

---

## Visual / material system (current)

- **Chassis:** Flat purple brushed aluminum (`--aluminum-mid`), grain + noise, stickers (Grizzlies, KFA, Vandy).
- **Drop shadow:** On a separate rounded shell (`ipod-chassis-shadow`) so iOS doesn’t draw square corner halos.
- **Click wheel:** Smooth darker rubber; center button matches aluminum and shares the hover light field.
- **LCD glass (Menu rest only):** Cool tint + hard gloss lip + diagonal window band; weaker elongated hover specular than metal.
- **Lighting:** CSS variables `--ipod-light-x/y` + `--ipod-sheen-opacity` from `useIpodLighting` — hover only, Menu zoom ≈ 0.

---

## Architecture (where code lives)

```
src/
  app/                    Next.js App Router
    layout.tsx            Root + Vercel Analytics
    globals.css           Tokens, metal/rubber/glass, gel select, etc.
    (portfolio)/          Routes that all mount PortfolioExperience
  components/
    portfolio/
      PortfolioExperience.tsx   Screen state, zoom spring, routing sync
    ipod/
      IpodDevice.tsx      Chassis, zoom geometry, glass tap, overlays
      ClickWheel.tsx      Wheel + center select
      CoverFlow.tsx       Cover Flow stage + cards
      CoverArt.tsx        Cover still + video/still reveal
      CaseStudyView.tsx   Case study chrome + banner/album hero
      CaseStudyBlocks.tsx Block renderer (text, media, grids, …)
      AboutScreen.tsx     Bio + contact
      NavigationDrawer.tsx
      HeroScreen.tsx      Menu LCD copy
      StatusBar.tsx / BatteryIcon / Stickers / …
  data/projects.ts        All project + case-study content
  hooks/
    useIpodLighting.ts
    useIsTouchScreen.ts
    useIpodChassisSize.ts
  lib/
    portfolioRoutes.ts    Path ↔ screen mapping + history replace rules
    chromeDensity.ts      Device vs stage status-bar sizing
public/assets/            Covers, case-study media, iPod chrome PNGs
```

**Mental model:** Cover Flow stays mounted under the glass for the whole session. About and case studies are **full-viewport overlays** on top (they do not flip the device into a separate “stageMode” layout for those screens — that avoided zoom flicker).

---

## Important behaviors / bugs already fixed

- **Menu LCD tap on mobile:** Closed nav used an empty full-glass `z-30` wrapper that ate touches → wrapper is `pointer-events-none`; drawer opts in when open.
- **Cover preview videos on iOS:** Don’t call `play()` while reveal is `opacity: 0`; play after crossfade; no second `<video>` in the reflection.
- **Chassis corner shadows:** Outer shadow not on the same node as `overflow: hidden`.
- **About on phones:** Type was stuck at clamp floors via tiny `cqi` → uses `vmin` so the intro fills more of the page.

---

## Stack

- Next.js **16.3** (App Router) · React **19** · TypeScript  
- Tailwind CSS **v4** · Framer Motion · Lucide · `@vercel/analytics`  
- Design source: Figma [Portfolio-MP3](https://www.figma.com/design/Q6g2C50Tgm8nj4B9kKVdSl/Portfolio-MP3)

---

## Contact / resume (as of this snapshot)

- Email: `joel.c.lim@vanderbilt.edu` (copy-to-clipboard in nav + About)  
- LinkedIn: `https://www.linkedin.com/in/joelchaelim/`  
- Resume: `https://drive.google.com/file/d/1ec7T6JgbBKFj4ljYxjV2yjy_gP_si70H/view?usp=sharing`

---

## How to restore this version

**From git (preferred):**
```bash
git fetch origin
git checkout snapshot/2026-08-13-pre-major
# or
git checkout snapshot-2026-08-13-pre-major
```

**From the zip:**
```bash
unzip mp3-design-portfolio-source.zip -d somewhere/
cd somewhere/mp3-design-portfolio-source
npm install
npm run dev
```

**Run locally from the repo as usual:**
```bash
npm install
npm run dev
```

---

## What’s intentionally *not* in this build

- Device-orientation / gyro lighting (explored, then dropped)  
- Full 3D / hybrid WebGL chassis (ruled out as not worth it for now)  
- Cover video on Wearitt (uses still PNG reveal instead)

---

*Generated as a working snapshot for major iteration. Keep this folder + the git tag even if `master` moves on.*
