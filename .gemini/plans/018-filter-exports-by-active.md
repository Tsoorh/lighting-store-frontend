# Plan 018: Filter exports by isActive

The user requested that PDF and Excel exports should only include products where `isActive` is `true`.

## Requirements
- Update the backend query for exports to filter out inactive products.
- Ensure consistency with how "active" products are defined in the rest of the application (i.e., not explicitly `false`).

## Proposed Changes

### Model
- `lighting-store-backend/model/product.model.ts`: Add `isActive?: boolean` to `FilterBy`.
- `lighting-store-frontend/src/model/product.model.ts`: Add `isActive?: boolean` to `FilterBy`.

### Backend Service
- `lighting-store-backend/api/product/products.service.ts`: Update `_getCriteria` to handle `isActive` filter.
    - If `isActive: true` is passed, use `{ $ne: false }`.
    - If `isActive: false` is passed, use `false`.
    - Maintain default behavior for non-admins (active only).

### Backend Controller
- `lighting-store-backend/api/product/product.controller.ts`: 
    - In `exportPdf`, pass `{ isActive: true }` to `productService.query()`.
    - In `exportExcel`, pass `{ isActive: true }` to `productService.query()`.

## Verification Plan
- Run backend build to ensure type safety.
- Manually verify that an admin (who can see all products in the UI) only gets active products in their PDF/Excel downloads.
