### point to improve on dashboard ###

1. price setting - when opening -supplier/architect set the multiplier to the current setting. (you can take from any user with the same role).

2. .admin-page - padding: 64px 80px. 

3. when adding/editing product: some fields shouldn't be free text
this are the selection option for the next field: 

  1. Wood Type (woodType)
  Stored as an array of objects. Common options:
   * Oak (אלון): {"he": "אלון", "en": "Oak"}
   * Walnut/Oak (אלון/אגוז): {"he": "אלון/אגוז", "en": "Walnut/Oak"}
   * Oak Stained as Walnut (אלון מגוון לאגוז): {"he": "אלון/אלון מגוון לאגוז", "en": "Oak/Oak stained as walnut"}
   * No Wood (ללא עץ): {"he": "ללא עץ", "en": "No wood"}

  2. Size (size)
  This is an array of objects containing the following numeric fields:
   * height
   * radius
   * Example: [{ "height": 30, "radius": 15 }]

  3. Category (category)
  Stored as an array of objects:
   * Hanging (תליה): {"he": "תליה", "en": "Hanging"}
   * Wall (קיר): {"he": "קיר", "en": "Wall"}
   * Ceiling (תקרה): {"he": "תקרה", "en": "Ceiling"}

  4. Screw Type (screwType)
  Stored inside the socketType object:
   * E27
   * G9
   * GU10
   * LED (Integrated)
   * Mixed: GU10 + E27 or G9, E27

  5. Light Type (lightType)
  Stored inside the socketType object, usually indicating max wattage:
   * LED - Max 5W / 7W / 10W / 15W / 20W / 35W
   * Example: LED - Max 10W

  6. Material (material)
  Stored as an array of objects:
   * Wood (עץ): {"he": "עץ", "en": "Wood"}
   * Metal (מתכת): {"he": "מתכת", "en": "Metal"}
   * Glass (זכוכית): {"he": "זכוכית", "en": "Glass"}