# Elohim's Legacy — 3D Particle Streetwear Experience

<p align="center">
  <br />
  <strong>Forged in Purpose, Worn in Legacy.</strong>
  <br />
  A high-craft 3D WebGL streetwear e-commerce experience showcasing the signature <em>"Directed by Elohim"</em> oversized heavyweight collection.
  <br /><br />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Three.js-r169-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/styled--components-6.1-DB7093?style=for-the-badge&logo=styled-components&logoColor=white" alt="styled-components" />
  <img src="https://img.shields.io/badge/ESLint-Strict_Zero_Warnings-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
</p>

---

## Overview

**Elohim's Legacy** combines contemporary luxury streetwear with interactive WebGL point-cloud physics. Rather than static product photography or heavy 3D polygonal meshes, real high-resolution garment imagery is decoded into **40,000 luminance-weighted particles** that dynamically respond to scroll progress, mouse gravity waves, and physical garment drape contours.

### Core Signature Drop: *"Directed by Elohim" Heavyweight Tee*
* **Garment Silhouette:** Boxy oversized fit, drop shoulder, soft-washed heavyweight black cotton.
* **Front Graphic:** Minimalist, bold *"Directed by Elohim"* logo print.
* **Back Print:** Matthew 6:9–13 (The Lord's Prayer) screened across the back in white ink.
* **Price:** $25 USD.
* **Commerce Mechanism:** Direct-to-WhatsApp order manifest generation for nationwide delivery across Zimbabwe.

---

## 3D WebGL Particle Architecture

The point-cloud simulation is rendered via a custom Three.js engine and tailored GLSL shaders:

### 1. Photometric Importance Sampling
* Real front and back tee photographs (`front.webp` and `back.webp`) are rasterized into an offscreen canvas to analyze pixel luminance:
  $$l = \frac{R + G + B}{765}$$
* **Typography Legibility Multiplier:** Pixels with $l > 0.5$ (the white printed scripture and front branding) are assigned **6× sampling probability** relative to dark cotton pixels ($l \le 0.5$).
* A cumulative distribution table binary searches point placement, concentrating density onto the printed typography so the text remains legible in 3D.

### 2. Parabolic Garment Draping Contour
Points are mapped to world coordinates with natural hanging cloth curvature along the Z-axis:
$$z = \text{dir} \times 0.45 \left(1 - 0.5 \left(\frac{X}{h_w}\right)^2\right) + \text{noise}$$
where $\text{dir} = 1$ for the front face and $\text{dir} = -1$ (with flipped $X$) for the back.

### 3. Scroll Keyframe State Machine (`KF`)
A 10-step cubic smoothstep interpolation matrix controls particle distribution as the user scrolls:

| Scroll Range | Section | Visual State |
| :--- | :--- | :--- |
| `u = 0.0 → 0.5` | **Hero** | Front-facing tee resting on the right side of the canvas. |
| `u = 0.5 → 1.0` | **Statement** | Particles disperse into a wide, 3D cosmic constellation. |
| `u = 1.0 → 2.4` | **Back Print** | Points re-converge and rotate 180° ($Y = \pi$) to reveal the Lord's Prayer. |
| `u = 2.4 → 3.8` | **Product Detail** | Tee re-aligns front-facing ($Y = 0$) adjacent to the size selector and buy CTA. |
| `u = 3.8 → 6.0` | **Catalog & Contact**| Garment dissolves into ambient background constellation dust. |

### 4. Interactive Physics & Shaders
* **Mouse Repulsion (`uMouse`):** When the cursor hovers near the garment, the custom vertex shader displaces particles radially along $XY$ with smooth falloff and pushes them forward along $Z$.
* **Harmonic Float:** $\sin(t \times 1.1) \times 0.2 \times (1 - \text{scatter})$ creates a subtle breathing motion (paused when `prefers-reduced-motion` is active).
* **Dual-Halo Glowing Cursor:** A 14px Alabaster cursor dot with twin Champagne Gold outer glows lerps smoothly behind desktop pointer coordinates.

---

## Project Structure

```
.
├── index (1).html                         # Original single-file reference
├── README.md                              # Repository documentation
├── .gitignore
└── elohims-legacy-react/                  # Production React + TypeScript application
    ├── index.html                         # App HTML template with webfonts
    ├── package.json                       # Dependencies & scripts
    ├── tsconfig.json                      # TypeScript strict compiler settings
    ├── vite.config.ts                     # Vite bundler configuration
    ├── .eslintrc.cjs                      # ESLint strict rules (no 'any' allowed)
    ├── .prettierrc                        # Code formatting configuration
    └── src/
        ├── main.tsx                       # React root entrypoint
        ├── App.tsx                        # Master layout & section orchestration
        ├── vite-env.d.ts                  # WebP asset type definitions
        ├── assets/
        │   ├── front.webp                 # Decoded front tee graphic
        │   └── back.webp                  # Decoded back print graphic (Matthew 6:9-13)
        ├── styles/
        │   ├── theme.ts                   # Brand color palette, typography tokens, breakpoints
        │   ├── styled.d.ts                # TypeScript DefaultTheme extension
        │   └── GlobalStyles.ts            # Global CSS reset, cursor rules, scroll-reveal classes
        ├── data/
        │   └── content.ts                 # Centralized copy, product catalog, contact info, TODOs
        ├── hooks/
        │   ├── useScrollProgress.ts       # Normalized scroll tracking with reduced-motion support
        │   ├── useMouse.ts                # Screen & NDC pointer coordinates, fine-pointer query
        │   ├── useCart.ts                 # Cart state, item addition, WhatsApp URL builder
        │   └── useReveal.ts               # IntersectionObserver for .rv fade-in animations
        ├── three/
        │   ├── ParticleSystem.ts          # Image sampling, luminance weighting, buffer generation
        │   ├── keyframes.ts               # KF matrix and cubic smoothstep math
        │   └── shaders.ts                 # Custom GLSL vertex & fragment shaders
        └── components/
            ├── Navbar.tsx                 # Brand wordmark, navigation links, cart counter pill
            ├── Cursor.tsx                 # Fluid glowing cursor with RAF lerp
            ├── Scene.tsx                  # Three.js canvas lifecycle, render loop, resource disposal
            ├── Loader.tsx                 # Full-screen "LOADING" screen with 0.8s fadeout
            ├── ProductCard.tsx            # Card component for active items and coming-soon drops
            └── sections/
                ├── HeroSection.tsx        # "Directed by Elohim" display headline
                ├── StatementSection.tsx   # "Faith you can wear..." brand statement
                ├── BackPrintSection.tsx   # Right-aligned Lord's Prayer section
                ├── ProductSection.tsx     # Size toggle pills (S-XL), price ($25), "Add to cart"
                ├── ShopSection.tsx        # 3-column responsive catalog grid (#shop)
                └── ContactSection.tsx     # Mailto link and 3-column Zimbabwe footer (#contact)
```

---

## Getting Started

### Prerequisites
* **Node.js:** v18.0.0 or later (v20+ recommended)
* **npm:** v9.0.0 or later

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Thabisomaqhawengwenya/elohims-legacy.git
   cd elohims-legacy/elohims-legacy-react
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

4. **Run the strict code quality gate:**
   ```bash
   npm run lint
   ```

5. **Generate a production build:**
   ```bash
   npm run build
   ```

6. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

---

## Store & WhatsApp Commerce Flow

1. **Size Selection:** Customers select their size (`S`, `M`, `L`, `XL`), with `M` pre-selected by default.
2. **Add to Cart:** Clicking **"Add to cart"** updates the cart counter in the navigation bar and flashes an `"Added ✓"` confirmation badge for 1.2s.
3. **Instant WhatsApp Order:** Clicking the **Cart** pill compiles all selected items into a formatted order message and opens WhatsApp directly:
   ```text
   Hi! I would like to order from Elohim's Legacy:
   - Directed by Elohim Tee (M) $25
   Total: $25
   ```
   Target link: `https://wa.me/263000000000?text=...`

---

## Configuration & Placeholders

All store copy, pricing, and placeholders are centralized in [`src/data/content.ts`](elohims-legacy-react/src/data/content.ts) with explicit `TODO` comments for easy customization:

* **WhatsApp Business Number:** Line 88 (`whatsAppNumber`)
* **Contact Email Address:** Line 68 (`email`)
* **Product Pricing:** Lines 6, 36, 47 (`price`)
* **Social Links & Footer Details:** Lines 71–85 (`orders`, `social`, `footerBrand`)

---

## License & Credits

* **Brand & Vision:** Elohim's Legacy — Directed by Elohim.
* **Developer & Designer:** Mr Q ([@Thabisomaqhawengwenya](https://github.com/Thabisomaqhawengwenya)).
* **License:** MIT License.
