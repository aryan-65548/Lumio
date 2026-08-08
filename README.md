<<<<<<< HEAD
# Lumio
HHGoa26 1st task
=======
# HackerHouse Goa 2026 — Builder Card / PFP Frame Generator

A highly art-directed, mobile-first, template-driven event microsite built for **HackerHouse Goa 2026**. Users can upload their photo, enter their details, select between two canonical themes (Goa Beach vs. Attack on Titan), generate high-resolution PFP cards, and share them directly on X (Twitter).

---

## 🌴 Two Visual Themes

1. **Goa Beach**: Tropical, beachy, retro-modern poster styling. The user's photo is cropped into a perfect circular shape and framed within the canvas, and their details are written inside input boxes in the poster's right half.
2. **Attack on Titan (AOT)**: Cinematic, distressed, military scout ID aesthetic. The user's photo is cropped to a `4:5` vertical ratio, color-graded to match the lighting of the scene (deep teal shadows, orange-red rim highlights, desaturated contrast), and placed in a card structure positioned centered above Eren Yeager's head.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion
- **Form Management**: React Hook Form
- **Assets**: Custom canonical frames stored in `public/assets/templates/`
- **Canvas Composition**: HTML5 Canvas API (rendered at 1080 × 1350 resolution on the client side)
- **Temporary Uploads**: `tmpfiles.org` anonymous ephemeral API
- **Developer Tools**: ESLint, PostCSS

---

## 📂 Folder Structure

```text
lumio/
├── app/
│   ├── api/
│   │   ├── health/
│   │   │   └── route.ts         # API health check
│   │   └── upload/
│   │       └── route.ts         # Ephemeral upload to tmpfiles.org
│   ├── share/
│   │   └── [id]/
│   │       └── page.tsx         # Open Graph share page with encoded parameters
│   ├── globals.css              # Custom font classes and particle keyframes
│   ├── layout.tsx               # Next.js custom typography imports and SEO metadata
│   └── page.tsx                 # Root dashboard managing empty -> edit -> result states
├── components/
│   ├── BuilderForm.tsx          # Real-time data inputs
│   ├── BuilderTitle.tsx         # Random tech title generator badge
│   ├── CardPreview.tsx          # Real-time responsive overlay preview
│   ├── GenerationState.tsx      # Full-screen theme loaders
│   ├── HackerHouseHeader.tsx    # Responsive brand header
│   ├── PhotoUploader.tsx        # File drag-drop and mobile camera inputs
│   ├── ResultScreen.tsx         # Action CTAs (download, share)
│   ├── ThemeBackground.tsx      # Cross-fading background overlays
│   └── ThemeSwitcher.tsx        # Animated slide selection bar
├── constants/
│   ├── builderTitles.ts         # Pool of Tech Titles
│   └── themes.ts                # Theme variables and dimension configs
├── hooks/
│   ├── usePhotoUpload.ts        # Drag-drop validation and HEIC handlers
│   └── useTheme.ts              # Theme persistence and selectors
├── public/
│   └── assets/
│       └── templates/           # Canonical frame templates
│           ├── aot-frame.png
│           └── goa-frame.png
├── utils/
│   ├── canvasUtils.ts           # Canvas 1080x1350 drawing engine
│   ├── imageUtils.ts            # Aspect-ratio crops and AOT color grading filters
│   └── titleGenerator.ts        # Randomizer
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Local Setup & Run

1. Clone or navigate to the workspace directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Run in development mode:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) on your desktop or mobile browser.

---

## 🎨 Image Compositions and Integrations

### 1. Smart Aspect-Ratio Crops & Face Visibility
When portrait images are uploaded, simple center crops can cut off faces. We calculate the excess height for portrait pictures and shift the cropping window vertically upward by 15%, ensuring that the head and face remain centered inside the frame. Target aspect ratios (`1:1` for Goa, `4:5` for AOT) are dynamically computed.

### 2. AOT Color Grading (Light Match)
To merge a natural user selfie into the red/teal illustrated environment of AOT, the Canvas renderer executes a pixel-level color grade:
- Boosts cinematic contrast.
- Desaturates overall colors by 45%.
- Injects warm orange/red highlights (`r += 32, g += 10`) in light regions to simulate reflection from the fire sky.
- Injects deep teal shadows (`r -= 20, b += 20`) in darker segments.
- Overlays radial gradients for a professional vignette outline.

### 3. Stateless X Sharing
X (Twitter) card crawler relies on absolute image URLs in Open Graph HTML headers to generate feed previews. We achieve this with a stateless design:
1. When clicking **Share to X**, the canvas base64 is uploaded to `tmpfiles.org`, which returns a transient public direct URL (expiring in 60 minutes).
2. The card's parameters (image URL, name, role, title) are packed into a single JSON object, base64-encoded, and appended to the share URL: `/share/[base64Data]`.
3. X crawler scrapes this page, parses the parameters, and displays the personalized image in the Twitter card layout.
4. Human visitors are redirected to the homepage or see the generated card with a large CTA to make their own.
5. No database, server, or cloud file storage costs!

