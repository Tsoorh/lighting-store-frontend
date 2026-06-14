# Plan 019: Product Details Wood and Wattage Update

## Overview
This plan addresses two display issues in the product details page:
1. Hide wood-related information (Wood Type label and disclaimer) when the product does not contain wood (i.e., when Wood Type is "No wood" or "ללא עץ").
2. Rename the "Voltage" technical specification label to "Wattage" (English) and "הספק" (Hebrew) to accurately reflect the data being displayed.

## Proposed Changes

### 1. `lighting-store-frontend/src/cmps/Product/ProductDetails.tsx`

#### Wood Logic
- Introduce a boolean `hasWood` to determine if wood-related info should be shown.
- `hasWood` will be true if `woodStr` is truthy and neither "No wood" nor "ללא עץ".
- Conditionally render the "Wood Type" list item and the ".natural-material-note" paragraph using `hasWood`.

#### Specification Label
- Change the label for `voltStr` from "Voltage:" / "מתח:" to "Wattage:" / "הספק:".

## Verification Plan

### Manual Verification
1. Open a product with wood (e.g., Oak).
   - Verify "Wood Type: Oak" is visible.
   - Verify the wood tone disclaimer is visible.
   - Verify "Wattage: [Value]" (or "הספק: [Value]") is visible instead of "Voltage".
2. Open a product without wood (Wood Type set to "No wood").
   - Verify "Wood Type" line is HIDDEN.
   - Verify the wood tone disclaimer is HIDDEN.
   - Verify "Wattage: [Value]" (or "הספק: [Value]") is visible.
3. Switch languages between Hebrew and English and verify labels are correct in both.
