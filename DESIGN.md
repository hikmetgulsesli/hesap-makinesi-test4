# Design System Document: The Precision-Grade Dark Interface

## 1. Overview & Creative North Star
This design system is built upon the Creative North Star of **"Atmospheric Logic."** We are moving away from the "toy-like" appearance of traditional mobile calculators to create a high-precision digital instrument. By leveraging deep tonal shifts, we create an environment that feels like a professional studio console—authoritative, immersive, and focused.

The system breaks the standard "grid of squares" through **intentional asymmetry** and **tonal layering**. We treat the calculator not as a flat surface, but as a series of recessed and elevated physical modules. The UI uses a high-contrast typography scale to ensure that the user’s data—the numbers—remain the undisputed hero of the experience.

---

## 2. Colors: Tonal Depth & Functional Vibrancy
We utilize a sophisticated Material-style palette to manage dark mode legibility. The primary blue and secondary amber are not just colors; they are functional signals within a low-light environment.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off the calculator keypad or sidebar. Boundaries must be defined solely through background shifts (e.g., the keypad sits on `surface-container-low` while individual buttons use `surface-container-high`) or subtle tonal transitions.

### Surface Hierarchy
To create a sense of "nested" depth, use the following tiers:
*   **Main App Background:** `surface` (#0c1322)
*   **The Display Area:** `surface-container-lowest` (#070e1d) — recessed to feel like a deep screen.
*   **The Keypad Area:** `surface-container-low` (#141b2b)
*   **Standard Buttons:** `surface-container-highest` (#2e3545) or `primary-container` (#2563eb).
*   **Floating History Sidebar:** `surface-bright` (#323949) with a 20px `backdrop-blur`.

### The "Glass & Gradient" Rule
To elevate the "Equals" and "Operator" buttons, do not use flat fills. Apply a subtle **Linear Gradient** (top-to-bottom) from the base color to its "Fixed Dim" variant (e.g., `secondary` to `secondary-fixed-dim`). This provides a tactile "soul" to the primary action points.

---

## 3. Typography: Editorial Utility
The typography pairings create a dialogue between technical precision (`Space Grotesk`) and readable utility (`Inter`).

*   **The Display (`display-lg` / `display-md`):** Uses `Space Grotesk`. At 3.5rem, it commands attention. The letter-spacing is tightened (-0.02em) to mimic high-end digital readouts.
*   **The Keypad (`title-lg`):** Uses `Inter` (Bold). These must be centered perfectly within buttons to ensure immediate recognition.
*   **History Sidebar (`body-md` / `label-sm`):** Uses `Inter`. Smaller, lighter weights are used here to create a clear hierarchy between the "active" calculation and "past" records.

| Role | Token | Font | Size | Weight |
| :--- | :--- | :--- | :--- | :--- |
| Active Result | `display-lg` | Space Grotesk | 3.5rem | 700 |
| Button Label | `title-lg` | Inter | 1.375rem | 700 |
| History Entry | `title-sm` | Inter | 1rem | 400 |
| Sidebar Label | `label-md` | Inter | 0.75rem | 500 |

---

## 4. Elevation & Depth: Tonal Layering
We reject drop shadows in favor of **Tonal Layering**. Depth is achieved by "stacking" surfaces.

*   **The Layering Principle:** A `surface-container-highest` button placed on a `surface-container-low` background creates a natural, soft lift.
*   **Ambient Shadows:** For floating elements like the history sidebar or tooltips, use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`. The shadow color must never be pure black; it should be a tinted version of `surface-container-lowest`.
*   **The Ghost Border Fallback:** If a button requires more definition against a similar background, use the `outline-variant` token at **15% opacity**. Never use 100% opaque borders.
*   **Glassmorphism:** The Sidebar uses `surface-bright` at 80% opacity with a `blur(12px)` to allow the keypad colors to softly bleed through, making the UI feel integrated.

---

## 5. Components

### Buttons (The Core Interaction)
*   **Standard (Numpad):** `surface-container-highest` background, `on-surface` text. Shape: `xl` (1.5rem) or `md` (0.75rem) depending on density.
*   **Operators (+, -, ×, ÷):** `secondary-container` (#ee9800) with `on-secondary-container` text. Use a subtle inner-glow on hover.
*   **The Equalizer (=):** `tertiary-container` (#007d55). This is the high-success moment. Use a slight gradient and `xl` rounded corners.
*   **Danger (C, ⌫):** `error_container` (#93000a) with `on-error-container` (#ffdad6).

### The History List
*   **Forbid Dividers:** Use `8px` of vertical whitespace and a background shift to `surface-container-low` on hover to separate history items.
*   **Asymmetry:** Align past results to the right and operators to the left to create a visual "staircase" effect that is easier to scan.

### The Display Component
*   **Layout:** High-contrast background (`surface-container-lowest`). Use `display-lg` for the current number and `headline-sm` in `outline` color for the running tally above it. 
*   **Padding:** Use `32px` (2rem) internal padding to give the numbers "room to breathe."

---

## 6. Do's and Don'ts

### Do:
*   **Do** use `xl` (1.5rem) rounding for the main keypad buttons to make them feel friendly yet modern.
*   **Do** use haptic feedback (if on mobile) to reinforce the "studio console" feel.
*   **Do** use `surface-variant` for inactive states or placeholder zeros.

### Don't:
*   **Don't** use 1px solid white or grey lines to separate the sidebar from the main app. Use a background color shift.
*   **Don't** use pure #000000 for the background. Use the specified `surface` (#0c1322) to maintain depth and reduce eye strain.
*   **Don't** use standard system "blue" for links. Always use the `primary` (#b4c5ff) or `primary_container` (#2563eb) tokens to stay within the brand's sophisticated tonal range.