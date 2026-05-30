### Category page design ###

1. the top of the page contain the current strip. (No cahnge)
2. the next section in ProductCategory.tsx - (ProductList.tsx):
- is placed 64px from the top strip and have 64px between the lines (vertical)
- 32px between the products (in line - horizontal)
- having the same max-width sizes to fit the other components of the site.
- is showing 9 products in page - 3 in each line. (ProductPreview.tsx).
- ProductPreview.tsx is showing the photo and the name (No price!) and 20px between the photo and the 
- ProductPreview.tsx the photo is taked from db - imgsUrl field: and choosing the photos which start with "C_" and look for it in cloudinary, if there's more than 1 photo make an horizontal scrolling, if there's no photo - use other photo availablr of the product. if no photos at all keep the current setting when theres no photo.
- Keep the current behaviour "Zoom in" when hovering on product.
-the product name setting: 
font-family: Heebo;
font-weight: 400;
font-style: Regular;
font-size: 20px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;
text-align: right;
vertical-align: middle;


IF NEED ACCESS TO FILES - ASK FOR!