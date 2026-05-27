### About page ###
1. Header - AppHeader.tsx component

2. the Main part: 
contain 2 parts with the gap of 64px, this gap is also between the 2nd part and the footer. 
part A:
Layout - 
    width: 1440;
    height: 1510;
    gap: 30px;
    angle: 0 deg;
    opacity: 1;
This layout has 2 sub-parts: 
A1 - Layout:
width: 1440;
height: 856;
gap: 32px;
angle: 0 deg;
opacity: 1;
padding-right: 80px;
padding-left: 80px;
 A1 layout contain Left and Right sections: 
 Left:  The photo - images/Figma/Tiran_About.png
        width: 624;
        height: 856;
        angle: 0 deg;
        opacity: 1;
 Right: Layout: 
        width: 624;
        height: 400;
        gap: 60px;
        angle: 0 deg;
        opacity: 1;
        padding-right: 60px;
        padding-left: 60px;
    Inside the right: in the middle: 
    width: 498;
    height: 400;
    gap: 40px;
    angle: 0 deg;
    opacity: 1;
    align in the center (vertical):
    Layout-
    width: 498;
    height: 255;
    angle: 0 deg;
    opacity: 1;
    
    Content-
    טירן לסרי חי תאורה מגיל צעיר.

הוא גדל לצד אביו, איש לחצן מתכת במקצועו, ולמד את יסודות המלאכה מתוך עבודה אמיתית: חומר, מכונה, משקל ודיוק. השנים הללו הניחו את היסוד לגישה המשלבת ידע טכני עמוק עם רגישות עיצובית.
 
בהמשך דרכו הקים רשת תאורה מצליחה בישראל, פיתח מוצרים והעמיק בהבנת התעשייה כולה: מתכנון וייצור ועד תצוגה ומכירה.
 
לאחר עשרות שנות עשייה בתעשייה, בחר לחזור לסטודיו ולעבודה ידנית. לחומר. לפרופורציה. לדיוק.
    
    Typography: 
    font-family: Heebo;
    font-weight: 500;
    font-style: Medium;
    font-size: 18px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: right;
    
    Apart from the first line - the rest inside a Span with that Typography: 
    font-family: Heebo;
    font-weight: 300;
    font-style: Light;
    font-size: 18px;
    leading-trim: NONE;
    line-height: 130%;
    letter-spacing: 0%;
    text-align: right;
     

    Color : text: rgba(30, 28, 25, 1);
Inside the right: in the right:
A "standing" line with two "balls" on the edges. Layout: 
width: 400.00000000000153;
height: 0px;
angle: -90 deg;
opacity: 1;
border-width: 1px;

Borders: border: 1px solid rgba(126, 133, 136, 1)



A2 - Layout:
width: 1440;
height: 624;
gap: 32px;
angle: 0 deg;
opacity: 1;
padding-right: 80px;
padding-left: 80px;

A2 is seperated into Right and Left: 
Right: 
 grid of 4 squre photos 2 at the top and 2 at the bottom: 
 Layout: 
 width: 624;
 height: 624;
 gap: 10px;
 angle: 0 deg;
 opacity: 1;
 
 photo size : 307px on 307px

the photos - from left top to bottom right: 
images/Figma/About_photo1.png
images/Figma/About_photo2.png
images/Figma/About_photo3.png
images/Figma/About_photo4.png

Left:
layout- 
width: 624;
height: 624;
gap: 60px;
angle: 0 deg;
opacity: 1;
padding-right: 60px;
padding-left: 60px;

top line - 
layout-
 width: 624;
height: 624;
gap: 60px;
angle: 0 deg;
opacity: 1;
padding-right: 60px;
padding-left: 60px;
background: rgba(255, 255, 255, 1);
border: 1px solid rgba(126, 133, 136, 1)

text - 
layout-
width: 498;
height: 207;
angle: 0 deg;
opacity: 1;
Content - 
בסטודיו שלו נוצרים גופי תאורה בעבודת יד המשלבים עץ, מתכת וזכוכית ליצירת אובייקטים פונקציונליים בעלי נוכחות פיסולית.
 
העבודות נולדות מתוך דיאלוג עם החלל, האור והאדם.
כל גוף תאורה נוצר כדי להאיר את המקום, אך גם להגדיר את האווירה שבו.
 
טירן עובד בשיתוף פעולה עם אדריכלים ומעצבי פנים המחפשים פתרונות תאורה מדויקים, איכותיים ועל־זמניים.

Typography - 
font-family: Heebo;
font-weight: 300;
font-style: Light;
font-size: 18px;
leading-trim: NONE;
line-height: 130%;
letter-spacing: 0%;
text-align: right;
text color rgba(30, 28, 25, 1);


Part B: 
Exact same as gradient-sec in HomePage.tsx
except - the title: דיוק שנבנה לאורך חיים שלמים
the word "דיוק" is the bolder span.


3. Footer - ContactSection.tsx Component


if you have quesations - create a plan file with the plan and questions before implemantation.
If you need access to files ask for it before implemantaition