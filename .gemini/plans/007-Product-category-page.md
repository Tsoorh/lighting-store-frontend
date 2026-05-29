### ProductCategory.tsx Page design:

### Core concept ###
*** The gap in this page ***:64px
*** Layout ***:
width: 1440;
height: 5360;
top: 104px;
gap: 64px;
angle: 0 deg;
opacity: 1;




1. At the Header you have AppHeader.tsx like in everypage. 

2. you have a strip with this design:
width: 1440;
height: 232;
gap: 10px;
angle: 0 deg;
opacity: 1;
padding-right: 80px;
padding-left: 80px;
background: rgba(126, 133, 136, 1);

3. THE STRIP CONTAIN:

3A. At the right : 

width: 635;
height: 53.0000114440918;
gap: 30px;
angle: 0 deg;
opacity: 1;
3A1. AT THE TOP INSIDE THE RIGHT - WHITE LINE WITH CIRCLE ON THE LEFT SIDE: THE DESIGN : 
width: 91.00000000000034;
height: 0px;
angle: -0 deg;
opacity: 0.5;
border-width: 1px;
LINE COLOR: rgba(255, 255, 255, 1);
border: 1px solid rgba(255, 255, 255, 1)

3A2.AT THE BOTTOM:
width: 635;
height: 23;
angle: 0 deg;
opacity: 1;
THE TEXT IS CHANGING BASED ON THE Product category in URL:
HANGING IS - גופי תאורה תלויים
Wall IS - גופי תאורה לקיר
Ceiling IS - גופי תאורה צמודי תקרה
font-family: Heebo;
font-weight: 300;
font-style: Light;
font-size: 32px;
leading-trim: CAP_HEIGHT;
line-height: 130%;
letter-spacing: 0%;
text-align: right;
vertical-align: middle;
TEXT COLOR: rgba(255, 255, 255, 1);

3B. At the left side: 
Changing picture based on the Product category in the url :
Wall - Header_Wall.png
Pendant - Header_Pendant.png
Ceiling - Header_Ceiling.png

###
check for product folder inside src/cmps/Products to show the products list of the current Category (From URL)

### AT THE BOTTOM OF THE PAGE : ###

cmp of ContactSection.tsx