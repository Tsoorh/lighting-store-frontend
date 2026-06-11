export const PRODUCT_OPTIONS = {
    WOOD_TYPES: [
        { en: 'Oak', he: 'אלון' },
        { en: 'Oak stained as walnut', he: 'אלון מגוון לאגוז' },
        { en: 'No wood', he: 'ללא עץ' },
        { en: 'Oak/American walnut', he:'אלון/אגוז אמריקאי' }
    ],
    CATEGORIES: [
        { en: 'Hanging', he: 'תליה' },
        { en: 'Wall', he: 'קיר' },
        { en: 'Ceiling', he: 'תקרה' },
        { en: 'Accessories', he: 'אביזרים' }
    ],
    MATERIALS: [
        { en: 'Wood', he: 'עץ' },
        { en: 'Metal', he: 'מתכת' },
        { en: 'Glass', he: 'זכוכית' }
    ],
    SCREW_TYPES: ['E27', 'G9', 'GU10', 'LED (Integrated)', 'Mixed: GU10 + E27', 'Mixed: G9 + E27'],
    LIGHT_TYPES: ['LED - Max 5W', 'LED - Max 7W', 'LED - Max 10W', 'LED - Max 15W', 'LED - Max 20W', 'LED - Max 35W']
} as const;
