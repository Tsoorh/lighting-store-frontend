# Plan 017: Filter 'C_' photos in ProductDetails

The user requested that photos starting with "C_" should not be shown on the `ProductDetails` page.

## Requirements
- Exclude all images whose filenames start with "C_" from the gallery in `ProductDetails.tsx`.
- Maintain the display of other images (starting with "H_" or others).

## Proposed Changes

### Frontend

#### `lighting-store-frontend/src/cmps/Product/ProductDetails.tsx`
- Remove `cPhotos` from the gallery sorting logic.
- Update `sortedPhotos` to only include `hPhotos` and `otherPhotos`.
- Update `getImageUrl` helper to reflect that `C_` photos are no longer processed.

## Verification Plan
- Open a product details page that is known to have "C_" photos (if any) and verify they are not shown.
- Verify that "H_" photos and other photos are still displayed correctly.
- Verify that the first image in the resulting list is set as the `mainImage`.
