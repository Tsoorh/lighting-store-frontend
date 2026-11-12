import type { FullProduct, hebrewEnglishObj } from '../model/product.model'
import { PRODUCT_OPTIONS } from '../constants/product.constants'

export type ProductPrice = NonNullable<FullProduct['price']>[number]
export type DirtyProductPrice = {
    wood?: Partial<hebrewEnglishObj>
    amount?: number
    size?: string
    sku?: string
}

// Merge split objects like [{he: 'A'}, {en: 'B'}] into [{he: 'A', en: 'B'}]
export function healHebrewEnglishArray(arr?: (Partial<hebrewEnglishObj> | null)[]): hebrewEnglishObj[] {
    if (!arr) return []

    const healed: hebrewEnglishObj[] = []
    let current: Partial<hebrewEnglishObj> = {}

    arr.forEach(item => {
        if (!item) return

        if (item.he && item.en) {
            healed.push({ he: item.he, en: item.en })
            return
        }

        if (item.he) {
            if (current.he) {
                healed.push({ he: current.he, en: current.en || '' })
                current = { he: item.he }
            } else {
                current.he = item.he
            }
        } else if (item.en) {
            if (current.en) {
                healed.push({ he: current.he || '', en: current.en })
                current = { en: item.en }
            } else {
                current.en = item.en
            }
        }

        if (current.he && current.en) {
            healed.push({ he: current.he, en: current.en })
            current = {}
        }
    })

    if (current.he || current.en) {
        healed.push({ he: current.he || '', en: current.en || '' })
    }

    return healed
}

// Ensure price entries have both languages if one is missing or inconsistent
export function healPriceArray(prices?: DirtyProductPrice[]): ProductPrice[] {
    if (!prices) return []
    const result: ProductPrice[] = []

    prices.forEach(p => {
        const woodNameEn = (p.wood?.en || '').trim()
        const woodNameHe = (p.wood?.he || '').trim()
        const amount = p.amount ?? 0

        // Expand "Oak/American walnut" so individual prices are editable
        if (
            woodNameEn.toLowerCase() === 'oak/american walnut' ||
            woodNameHe === 'אלון/אגוז אמריקאי'
        ) {
            result.push({ ...p, amount, wood: { en: 'Oak', he: 'אלון' } })
            result.push({ ...p, amount, wood: { en: 'American walnut', he: 'אגוז אמריקאי' } })
            return
        }

        if (
            woodNameEn.toLowerCase() === 'oak stained walnut' ||
            woodNameEn.toLowerCase() === 'oak stained as walnut' ||
            woodNameHe === 'אלון מגוון לאגוז'
        ) {
            result.push({ ...p, amount, wood: { en: 'Oak stained Walnut', he: 'אלון מגוון לאגוז' } })
            return
        }

        const found = (PRODUCT_OPTIONS.WOOD_TYPES as unknown as hebrewEnglishObj[]).find(opt =>
            (woodNameEn && opt.en.toLowerCase() === woodNameEn.toLowerCase()) ||
            (woodNameHe && opt.he === woodNameHe)
        )
            || (woodNameEn.toLowerCase().includes('american') && woodNameEn.toLowerCase().includes('walnut')
                ? { en: 'American walnut', he: 'אגוז אמריקאי' }
                : null)
            || (woodNameEn.toLowerCase() === 'oak' ? { en: 'Oak', he: 'אלון' } : null)

        if (found) {
            result.push({ ...p, amount, wood: found })
        } else if (woodNameEn || woodNameHe) {
            result.push({ ...p, amount, wood: { en: woodNameEn || woodNameHe, he: woodNameHe || woodNameEn } })
        } else {
            result.push({ ...p, amount, wood: { en: 'Standard / No wood', he: 'מחיר כללי / ללא עץ' } })
        }
    })

    return result
}

export function matchesWood(w1?: { en?: string; he?: string }, w2?: { en?: string; he?: string }): boolean {
    if (!w1 || !w2) return false
    const en1 = (w1.en || '').trim().toLowerCase()
    const en2 = (w2.en || '').trim().toLowerCase()
    if (en1 && en2 && en1 === en2) return true

    const he1 = (w1.he || '').trim()
    const he2 = (w2.he || '').trim()
    if (he1 && he2 && he1 === he2) return true

    return false
}
