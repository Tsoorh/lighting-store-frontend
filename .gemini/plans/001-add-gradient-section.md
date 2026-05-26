# Plan: 001 - Add Gradient Section to Home Page

## 1. Requirements Summary
Add a new section to the `HomePage` below the "Works" section (`.works-sec`). The section will display a specific background image, custom typography with mixed font weights, a decorative dividing line, and a Call-to-Action (CTA) button with an icon. 

## 2. Architecture & Components (`src/pages/HomePage.tsx`)
*   **New Section Element:** Add a `<section>` or `<div>` with a new class (e.g., `.gradient-sec`).
*   **Typography:** The text "פרטים קטנים. נוכחות גדולה." needs to be split. We will use a wrapper for the text and `<span>` elements for each part to apply the different `font-weight` and `letter-spacing` properties.
*   **Decorative Line:** A `<div>` representing the line, using CSS pseudo-elements (`::after` or `::before`) for the center circle.
*   **CTA Button:** An `<a>` or `<button>` wrapper using `flex` with `justify-content: space-between`, containing the text and the `<Icons iconName='back' />` component.

## 3. Styling & CSS (`src/pages/HomePage.css`)
*   **`.gradient-sec`:** 
    *   `background-image: url('/images/Figma/GRADIENT_MAIN.jpg')`
    *   `height: 232px` (and 100% width)
    *   `display: flex`, `flex-direction: column`, `align-items: center`, `justify-content: center`
    *   `gap: 32px`
*   **Typography Classes:**
    *   `.gradient-text-light`: Heebo, weight 300, 32px.
    *   `.gradient-text-medium`: Heebo, weight 500, 32px, `letter-spacing: 0.06em` (6%).
*   **`.gradient-divider`:**
    *   `width: 214px`, `height: 1px` (or appropriate thickness).
    *   `background-color: rgba(30, 28, 25, 1)`.
    *   Use an absolutely positioned `::after` element for the circle in the exact center.
*   **`.gradient-cta`:**
    *   `display: flex`, `justify-content: space-between`, `align-items: center`.
    *   Inherit typography logic and hover transitions (similar to `.entry-cta`).

## 4. Edge Cases & Responsive Design
*   **Mobile View (`max-width: 768px`):** The fixed height of `232px` might need adjustment on very small screens, or the 32px font size might be too large and cause unwanted line breaks. I suggest adding a clamp or media query for the font size (`clamp(24px, 4vw, 32px)`).
*   **Background Image Scaling:** Use `background-size: cover` and `background-position: center` to ensure the image looks good on ultra-wide screens (above 1440px) without stretching out of proportion.

## 5. Next Steps
1.  Review this plan.
2.  Decide if we want to add responsive typography (e.g., `clamp()`) to avoid mobile layout breaking. YES! 
3.  Approve to begin Phase 2: Implementation.