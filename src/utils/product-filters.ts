import type { FullProduct, ProductFilterCriteria } from '../model/product.model'

export type ProductSortOrder = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'asc' | 'desc'

export function isProductNew(product?: Partial<FullProduct> | null): boolean {
    if (!product) return false
    return Boolean(
        product.isNew ||
        product.category?.some(c => c.en?.toLowerCase().includes('new') || c.he?.includes('חדש'))
    )
}

export function formatProductPriceRange(price?: FullProduct['price']): string | null {
    if (!price || !Array.isArray(price)) return null
    const amounts = price.filter(p => p.amount !== undefined).map(p => p.amount as number)
    if (amounts.length === 0) return null
    const min = Math.min(...amounts)
    const max = Math.max(...amounts)
    return min === max ? `₪${min}` : `₪${min} - ₪${max}`
}

export function filterProducts(products: FullProduct[] | undefined, filters: ProductFilterCriteria): FullProduct[] {
    if (!products || !Array.isArray(products)) return []

    return products.filter(product => {
        if (filters.txt) {
            const q = filters.txt.trim().toLowerCase()
            const nameHe = product.name?.he?.toLowerCase() || ''
            const nameEn = product.name?.en?.toLowerCase() || ''
            const descHe = product.description?.he?.toLowerCase() || ''
            const descEn = product.description?.en?.toLowerCase() || ''
            if (!nameHe.includes(q) && !nameEn.includes(q) && !descHe.includes(q) && !descEn.includes(q)) {
                return false
            }
        }

        if (filters.category && filters.category.length > 0) {
            const prodCats = (product.category || []).map(c => c.en.toLowerCase())
            const prodNew = isProductNew(product)
            const hasCategory = filters.category.some(filterCat => {
                const f = filterCat.toLowerCase()
                if (f === 'hanging' || f === 'pendant') {
                    return prodCats.includes('hanging') || prodCats.includes('pendant')
                }
                if (f.includes('new')) {
                    return prodNew || prodCats.some(c => c.includes('new'))
                }
                return prodCats.includes(f)
            })
            if (!hasCategory) return false
        }

        if (filters.material && filters.material.length > 0) {
            const prodMats = (product.material || []).map(m => m.en.toLowerCase())
            const hasMat = filters.material.some(m => prodMats.includes(m.toLowerCase()))
            if (!hasMat) return false
        }

        if (filters.woodType && filters.woodType.length > 0) {
            const prodWoods = new Set<string>()
            product.woodType?.forEach(w => prodWoods.add(w.en.toLowerCase()))
            product.price?.forEach(pr => {
                if (pr.wood?.en) prodWoods.add(pr.wood.en.toLowerCase())
            })

            const hasWood = filters.woodType.some(targetWood => {
                const t = targetWood.toLowerCase()
                if (t === 'oak') {
                    return prodWoods.has('oak') || prodWoods.has('oak/american walnut') || prodWoods.has('oak stained walnut')
                }
                if (t === 'american walnut') {
                    return prodWoods.has('american walnut') || prodWoods.has('oak/american walnut')
                }
                return prodWoods.has(t)
            })
            if (!hasWood) return false
        }

        if (filters.screwType && filters.screwType.length > 0) {
            const prodScrew = (product.socketType?.screwType || '').trim().toLowerCase()
            if (!prodScrew) return false
            const hasScrew = filters.screwType.some(s => prodScrew === s.trim().toLowerCase())
            if (!hasScrew) return false
        }

        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            if (!product.price || !Array.isArray(product.price) || product.price.length === 0) {
                return false
            }
            const amounts = product.price.filter(pr => pr.amount !== undefined).map(pr => pr.amount as number)
            if (amounts.length === 0) return false
            const minAmount = Math.min(...amounts)
            const maxAmount = Math.max(...amounts)

            if (filters.minPrice !== undefined && maxAmount < filters.minPrice) return false
            if (filters.maxPrice !== undefined && minAmount > filters.maxPrice) return false
        }

        return true
    })
}

export function sortProducts(
    products: FullProduct[],
    sortOrder: ProductSortOrder,
    isEnglish: boolean
): FullProduct[] {
    return [...products].sort((a, b) => {
        if (sortOrder === 'price-asc' || sortOrder === 'price-desc') {
            const getPrice = (p: FullProduct) => {
                const amounts = (p.price || []).filter(pr => pr.amount !== undefined).map(pr => pr.amount as number)
                return amounts.length > 0 ? Math.min(...amounts) : (sortOrder === 'price-asc' ? Infinity : -Infinity)
            }
            const priceA = getPrice(a)
            const priceB = getPrice(b)
            return sortOrder === 'price-asc' ? priceA - priceB : priceB - priceA
        }

        const nameA = (isEnglish ? a.name?.en : a.name?.he) || ''
        const nameB = (isEnglish ? b.name?.en : b.name?.he) || ''
        const comparison = nameA.localeCompare(nameB, isEnglish ? 'en' : 'he')
        return (sortOrder === 'desc' || sortOrder === 'name-desc') ? -comparison : comparison
    })
}
