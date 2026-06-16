# Plan 020: Admin Dashboard Mobile Adjustments

Improve the mobile and small screen experience for the admin dashboard in `lighting-store-frontend`.

## 1. Context Verification
- `lighting-store-frontend/src/pages/AdminPage.tsx`: Main admin layout.
- `lighting-store-frontend/src/assets/styles/pages/AdminPage.css`: Admin styles.
- `lighting-store-frontend/src/cmps/Admin/AdminProductList.tsx`: Product list table.
- `lighting-store-frontend/src/cmps/Admin/AdminUserList.tsx`: User list table.
- `lighting-store-frontend/src/cmps/Admin/AdminPriceSettings.tsx`: Price settings form.
- `lighting-store-frontend/src/cmps/Admin/AdminProductEdit.tsx`: Product edit form.

## 2. Proposed Changes

### 2.1 CSS Enhancements (`AdminPage.css`)
- **Header & Tabs**:
    - Ensure `.admin-header` is centered or adjusted for small screens.
    - Make `.admin-tabs` horizontally scrollable on mobile to avoid wrapping or squeezing.
- **Tables**:
    - Enhance `.table-responsive` to handle overflow better.
    - Add media queries to transform `.admin-table` into a "card-like" layout on screens < 600px where each row becomes a block.
- **Forms**:
    - Refine `.admin-edit-form` to ensure padding and margins are optimal for mobile.
    - Ensure `.form-actions` (Save/Cancel buttons) are easily clickable and stack vertically on mobile.
    - Fix any issues with nested lists (like price or size rows) in the product edit form.

### 2.2 Component Adjustments
- **`AdminPriceSettings.tsx`**:
    - Move inline styles to `AdminPage.css` or use standard classes.
    - Ensure the layout is clean on small screens.
- **`AdminProductList.tsx` & `AdminUserList.tsx`**:
    - Check if the "Add" button and search bar need layout changes on mobile (e.g., stacking).

### 2.3 UX Improvements
- **Loaders**:
    - Add a loading spinner or skeleton while products or users are being fetched.
    - Ensure the loader is centered and consistent across all admin tabs.

## 3. Detailed Steps

### Step 1: Update `AdminPage.css`
- Add horizontal scrolling to `.admin-tabs`.
- Implement card view for tables on mobile.
- Refine form responsiveness.
- Add styles for the loader.

### Step 2: Update `AdminPriceSettings.tsx`
- Replace inline styles with CSS classes.
- Ensure the container is responsive.

### Step 3: Update `AdminProductList.tsx` & `AdminUserList.tsx`
- Improve layout of the list header (search + add button) for mobile.
- Implement `isLoading` state and display a loader while fetching data.

### Step 4: Verification
- Test on different screen sizes (Desktop, Tablet, Mobile).
- Verify RTL/LTR support.

## 4. Testing Strategy
- Manual testing using browser dev tools (mobile emulation).
- Verify that all admin functionalities (add, edit, delete, toggle status) remain accessible and usable on a 375px wide screen (iPhone SE size).
