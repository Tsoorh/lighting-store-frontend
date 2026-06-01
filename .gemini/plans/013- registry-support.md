### Logic ###

there's 4 types of profile in the website: 
1.Normal guest 
2.Admin
3.Supplier
4.Architect


### Profile specification ### 
1. Normal - in the normal guest the site doesn't show any prices at all.
2. Admin - admin can add/remove/update products and prices and everything.
3. Supplier - if a user is login as a supplier he can see prices based on a special price formule for a supplier. I will update the formula later for now make it 50% from the original product price.
4. Architect - same as Supplier with different price formola make itfor now like 110% pf the original.


### relevant pages ### 
On the AppHeader add an Login icon that lead to a new page - Register.
this page contain username and password.


## The login support ##
the site should check in the relevant product pages if the user is logged in and if so to show the prices of the user.


## Admin support ## 
create a page for the admin to edit/add/remove product and also edit/add/remove/manage users.
this account can make changes in the db! it should have a special page to navigate from appheader.

i updated the db - user collection with the next fields, for example. -
{
  "_id": {
    "$oid": "692b0f8e179247939177b441"
  },
  "password": "$2a$10$IYzzMU0U8qyA9AX2k4ecse41AS1wjGmr77DRikAwrmqJE3fyIXeVG",
  "fullname": "admin",
  "isAdmin": true,
  "username": "admin",
  "priceMultiplier": 1,
  "role": "Admin",
  "showPrices": true
}

i also update the product entity on db like this- 
{
  "_id": {
    "$oid": "694d2a2f9d6ceb17ea937191"
  },
  "description": {
    "en": "A refined addition to any modern interior, the Soprano 53 Hanging fixture is a testament to fine craftsmanship. With dimensions of 53cm diameter and 24cm height, it offers a balanced presence. This model is compatible with E27 (LED - Max 35W) bulbs, providing optimal illumination.",
    "he": "שילוב חומרים מרתק של עץ ומתכת ואלון/אגוז מעניק ל-סופרנו 53 נוכחות חמה ומלאת סטייל. עם נוכחות של קוטר של 53 ס\"מ וגובה של 24 ס\"מ, ה-סופרנו 53 מעניק פרשנות חדשה לתאורה יוקרתית. הדגם מתאים לנורות E27 מסוג LED - Max 35W, המבטיחות תאורה אופטימלית וחסכונית."
  },
  "name": {
    "he": "סופרנו 53",
    "en": "Soprano 53"
  },
  "price": 1000,
  "imgsUrl": [
    "1946",
    "C_P60",
    "H_P60"
  ],
  "size": [
    {
      "radius": 53,
      "height": 24
    }
  ],
  "woodType": [
    {
      "he": "אלון/אגוז",
      "en": "Walnut/Oak"
    }
  ],
  "material": [
    {
      "he": "עץ",
      "en": "Wood"
    },
    {
      "he": "מתכת",
      "en": "metal"
    }
  ],
  "socketType": {
    "screwType": "E27",
    "lightType": "LED - Max 35W"
  },
  "category": [
    {
      "he": "תליה",
      "en": "Hanging"
    }
  ],
  "isActive": true
}

support it in frontend and backend level.


Update the backend api inside user-[/lighting-store-backend/api/user] and authentication-[/lighting-store-backend/api/auth] and product-[/lighting-store-backend/api/product].

If you need access to any file. ask for it before starting implemantation.
