# Chiram Design System — Theme Reference

> **Theme:** Dark Premium + Glassmorphism + Orange Brand  
> **Origin project:** `chiramlimited.in` / `chiraminc.blogspot.com`  
> Copy `index.css` into any project and include the Google Fonts `@import` to apply this theme instantly.

---

## 1. Google Fonts

Add this `@import` as the **first line** of your CSS file (or as a `<link>` in `<head>`):

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap');
```

Or via HTML `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
```

| Variable          | Font          | Role                              |
|-------------------|---------------|-----------------------------------|
| `--font-main`     | `Inter`       | Body text, labels, paragraphs     |
| `--font-display`  | `Outfit`      | Headings, logos, card titles      |

---

## 2. CSS Design Tokens (`:root` Variables)

Paste this `:root` block into your CSS to get all tokens:

```css
:root {
  /* Brand */
  --brand:         #cc6611;                    /* Primary orange */
  --brand-light:   #e07830;                    /* Hover / lighter orange */
  --brand-glow:    rgba(204, 102, 17, 0.35);   /* Glow / shadow tint */

  /* Backgrounds */
  --bg-dark:       #0f0e0c;                    /* Page background */
  --bg-card:       rgba(255, 255, 255, 0.05);  /* Glass card surface */
  --bg-card-hover: rgba(255, 255, 255, 0.09);  /* Glass card on hover */

  /* Borders */
  --border-glass:  rgba(255, 255, 255, 0.10);  /* Subtle glass border */

  /* Text */
  --text-primary:  #f0ede8;   /* Headings, body */
  --text-secondary:#a89880;   /* Subheadings, descriptions */
  --text-muted:    #6b5f52;   /* Captions, metadata, footer */

  /* Shape */
  --radius-card:   16px;      /* Cards, panels */
  --radius-btn:    8px;       /* Buttons */

  /* Effects */
  --shadow-glow:   0 0 40px rgba(204, 102, 17, 0.15);   /* Orange ambient glow */
  --transition:    0.25s cubic-bezier(0.4, 0, 0.2, 1);  /* Standard easing */

  /* Fonts */
  --font-main:     'Inter', sans-serif;
  --font-display:  'Outfit', sans-serif;
}
```

---

## 3. Color Palette

| Swatch | Token | Hex / Value | Use |
|--------|-------|-------------|-----|
| 🟠 | `--brand` | `#cc6611` | CTAs, icons, section labels, accents |
| 🔶 | `--brand-light` | `#e07830` | Hover states, links, read-more text |
| ⬛ | `--bg-dark` | `#0f0e0c` | Page background |
| 🪟 | `--bg-card` | `rgba(255,255,255,0.05)` | Glassmorphism card fill |
| 🪟 | `--bg-card-hover` | `rgba(255,255,255,0.09)` | Glassmorphism card hover |
| ➖ | `--border-glass` | `rgba(255,255,255,0.10)` | Card/divider borders |
| 🤍 | `--text-primary` | `#f0ede8` | Main readable text |
| 🩶 | `--text-secondary` | `#a89880` | Descriptions, subtitles |
| 🫥 | `--text-muted` | `#6b5f52` | Metadata, captions |

---

## 4. Page Background

The body uses a dark base with two radial gradient glows to give the page depth:

```css
body {
  background-color: var(--bg-dark);
  background-image:
    /* Top-center orange glow */
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(204,102,17,0.18) 0%, transparent 60%),
    /* Bottom-right subtle warm glow */
    radial-gradient(ellipse 60% 40% at 80% 100%, rgba(204,102,17,0.08) 0%, transparent 50%);
}
```

> **Tip:** Adjust the `0.18` / `0.08` opacity values to make the glow more or less intense.

---

## 5. Glassmorphism Card Pattern

The core pattern for any glassmorphism card:

```css
.glass-card {
  background: var(--bg-card);               /* 5% white overlay */
  border: 1px solid var(--border-glass);    /* Subtle white border */
  border-radius: var(--radius-card);        /* 16px */
  backdrop-filter: blur(8px);              /* Frosted glass blur */
  -webkit-backdrop-filter: blur(8px);
  transition: all var(--transition);
}

.glass-card:hover {
  background: var(--bg-card-hover);
  border-color: rgba(204, 102, 17, 0.4);   /* Brand tint on hover */
  transform: translateY(-4px);             /* Lift effect */
  box-shadow: 0 12px 40px rgba(0,0,0,0.4), var(--shadow-glow);
}
```

**Optional: glowing top border line on hover**

```css
.glass-card {
  position: relative;
  overflow: hidden;
}
.glass-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--brand), transparent);
  opacity: 0;
  transition: opacity var(--transition);
}
.glass-card:hover::before { opacity: 1; }
```

---

## 6. Typography Scale

```css
/* Display / Hero heading */
h1 {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 7vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1.5px;
  /* Gradient text */
  background: linear-gradient(135deg, #ffffff 0%, #e0cdb8 60%, var(--brand) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Section heading */
h2 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.2rem);
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  line-height: 1.2;
}

/* Card heading */
h3 {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.35;
}

/* Body / description */
p {
  font-family: var(--font-main);
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
  font-weight: 400;
}
```

---

## 7. Buttons

```css
/* Base */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.4rem;
  border-radius: var(--radius-btn);   /* 8px */
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all var(--transition);
  border: none;
  white-space: nowrap;
}

/* Primary – filled orange gradient */
.btn-primary {
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%);
  color: #fff;
  box-shadow: 0 4px 20px rgba(204,102,17,0.4);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(204,102,17,0.55);
}

/* Outline – ghost style */
.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-glass);
}
.btn-outline:hover {
  background: var(--bg-card-hover);
  border-color: var(--brand);
  color: var(--brand);
}
```

---

## 8. Section Label Pattern

Small ALL-CAPS label above section headings:

```html
<div class="section-header">
  <span class="section-label">Category Tag</span>
  <h2>Section Title</h2>
  <p>Optional description text.</p>
</div>
```

```css
.section-label {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 0.6rem;
}
```

---

## 9. Sticky Glass Header

```css
.site-header {
  position: sticky;
  top: 0;
  height: 64px;
  padding: 0 2rem;
  background: rgba(15, 14, 12, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-glass);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

---

## 10. Scroll-Reveal Animation

Add `.reveal` to any element. JavaScript toggles `.visible` when it enters the viewport.

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**JS — drop this in any script:**

```js
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(function (el) {
  revealObserver.observe(el);
});
```

---

## 11. Hero Section Structure

```html
<section class="hero reveal">
  <div class="hero-badge">Your Tag Line Here</div>
  <h1>Main Headline<br>Goes Here</h1>
  <p>Supporting description sentence.</p>
  <div class="hero-actions">
    <a href="#" class="btn btn-primary">Primary Action</a>
    <a href="#" class="btn btn-outline">Secondary Action</a>
  </div>
</section>
```

The hero badge gets a `⬡` prefix automatically via `::before`.

---

## 12. Stats Strip

Horizontal bar of metrics. Dividers between items are automatic:

```html
<div class="stats-strip">
  <div class="stat-item">
    <span class="stat-num">100+</span>
    <span class="stat-label">Users</span>
  </div>
  <div class="stat-item">
    <span class="stat-num">4+</span>
    <span class="stat-label">Tools</span>
  </div>
  <!-- repeat as needed -->
</div>
```

---

## 13. Adapting to a Different Brand Color

To swap the orange `#cc6611` for any other brand color, update **only** these four token values in `:root`:

```css
:root {
  --brand:       #YOUR_COLOR;
  --brand-light: #YOUR_LIGHTER_COLOR;
  --brand-glow:  rgba(R, G, B, 0.35);   /* same RGB as brand */
  --shadow-glow: 0 0 40px rgba(R, G, B, 0.15);
}
```

All glassmorphism hover tints, button gradients, badge backgrounds, and glow effects will update automatically.

---

## 14. Responsive Breakpoints

| Breakpoint | Behaviour |
|------------|-----------|
| `≤ 768px` | Single-column tool/blog grids; stats wrap 2×2; header tagline hidden; padding reduced |

```css
@media (max-width: 768px) {
  .hero          { padding: 3.5rem 1.25rem 3rem; }
  .page-section  { padding: 2.5rem 1.25rem; }
  .stats-strip   { flex-wrap: wrap; }
  .stat-item     { flex: 1 1 50%; }
  .header-tagline{ display: none; }
}
```

---

## 15. Quick Checklist — Applying to a New Project

- [ ] Add Google Fonts `@import` or `<link>` tags
- [ ] Copy `:root` token block into your CSS
- [ ] Add body background (`background-color` + `background-image` gradients)
- [ ] Add `.reveal` CSS + JS observer for scroll animations
- [ ] Use `.btn` / `.btn-primary` / `.btn-outline` for all CTA buttons
- [ ] Use `.glass-card` pattern for any card/panel component
- [ ] Use `.section-label` + `h2` pattern for each content section
- [ ] Bump `"version"` in `version.js` after any CSS/JS update

