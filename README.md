# Robotics Landing Page

A fast, responsive landing page for Robotics (the school) built with React, Vite, and Tailwind CSS.

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run local dev server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## ⚙️ Customization Guide

All navigation links, logos, cards, and modal content are centrally configured in [`src/config/siteConfig.js`](./src/config/siteConfig.js).

### 1. Customizing Navigation Links (Top-Right Navbar)
In `siteConfig.js`, edit the `navLinks` array:
- **Modal Popup**: Set `actionType: "modal"` and provide `modalData` (title, badge, description, bullet points, stats, etc.).
- **Direct Link / URL**: Set `actionType: "link"`, provide `href: "https://..."` or `href: "#section"`.

### 2. Customizing Bento Grid Cards
In `siteConfig.js`, edit `gridSection`:
- **`leftCards`**: Array of cards stacked vertically on the left (e.g. `VIQRC Teams`, `V5RC Teams`).
- **`rightCard`**: Large featured card on the right (e.g. `team example-tournament`).
- Each card supports:
  - `title`, `subtitle`
  - `image`: Path in `public/images/`
  - `overlayGradient`, `tintColor`, `borderColor`
  - `actionType`: `"modal"` or `"link"`
  - `href` or `modalData`

### 3. Logos & Assets
- sponsor Logo: `public/logos/sponsor.png`
- team School Logo: `public/logos/logo.png`
- Competition Images: `public/images/`
