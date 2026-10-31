import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { productService } from "../../services/product.service"
import type { FilterBy, FullProduct, ProductFilterCriteria } from "../../model/product.model"
import { ProductFilter } from "./ProductFilter"
import { ProductList } from "./ProductList"
import { SkeletonProductPreview } from "../Skeleton/SkeletonProductPreview"
import { useLanguage } from "../../hooks/useLanguage"

type ProductIndexProps = {
    filterBy?: FilterBy
    enableFiltering?: boolean
}

export const ProductIndex = ({ filterBy = {}, enableFiltering = true }: ProductIndexProps) => {
    const { language } = useLanguage()
    const isEn = language === 'en'

    const [filters, setFilters] = useState<ProductFilterCriteria>({})
    const [sortOrder, setSortOrder] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'asc' | 'desc'>('name-asc')
    const [page, setPage] = useState(1)

    const { data: products, isLoading } = useQuery<FullProduct[]>({
        queryKey: ['products', filterBy],
        queryFn: async () => {
            const res = await productService.query(filterBy)
            return (res as FullProduct[]) || []
        },
        select: (data) => Array.isArray(data) ? data : []
    })

    const onFilterChange = (newFilters: ProductFilterCriteria) => {
        setFilters(newFilters)
        setPage(1)
    }

    const onResetFilters = () => {
        setFilters({})
        setPage(1)
    }

    // Filter products
    const filteredProducts = useMemo(() => {
        if (!products || !Array.isArray(products)) return []
        if (!enableFiltering) return products

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
                const hasCategory = filters.category.some(filterCat => {
                    const f = filterCat.toLowerCase()
                    if (f === 'hanging' || f === 'pendant') {
                        return prodCats.includes('hanging') || prodCats.includes('pendant')
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

            // 5. Socket / Screw Type Filter (Strict exact equality)
            if (filters.screwType && filters.screwType.length > 0) {
                const prodScrew = (product.socketType?.screwType || '').trim().toLowerCase()
                if (!prodScrew) return false
                const hasScrew = filters.screwType.some(s => prodScrew === s.trim().toLowerCase())
                if (!hasScrew) return false
            }

            return true
        })
    }, [products, filters, enableFiltering])

    // Sort products
    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            if (sortOrder === 'price-asc' || sortOrder === 'price-desc') {
                const getPrice = (p: FullProduct) => {
                    const amounts = (p.price || []).filter(pr => pr.amount !== undefined).map(pr => pr.amount as number)
                    return amounts.length > 0 ? Math.min(...amounts) : (sortOrder === 'price-asc' ? Infinity : -Infinity)
                }
                const priceA = getPrice(a)
                const priceB = getPrice(b)
                return sortOrder === 'price-asc' ? priceA - priceB : priceB - priceA
            }

            const nameA = (isEn ? a.name?.en : a.name?.he) || ''
            const nameB = (isEn ? b.name?.en : b.name?.he) || ''
            const comparison = nameA.localeCompare(nameB, isEn ? 'en' : 'he')
            return (sortOrder === 'desc' || sortOrder === 'name-desc') ? -comparison : comparison
        })
    }, [filteredProducts, sortOrder, isEn])

    if (isLoading) {
        return (
            <div className="product-list">
                {[...Array(6)].map((_, i) => (
                    <SkeletonProductPreview key={i} />
                ))}
            </div>
        )
    }

    if (!products || products.length === 0) {
        return <div className="no-products">{isEn ? 'No products to show' : 'אין מוצרים להצגה'}</div>
    }

    return (
        <div className="product-index-container">
            {enableFiltering && (
                <ProductFilter
                    filters={filters}
                    onFilterChange={onFilterChange}
                    onResetFilters={onResetFilters}
                    products={products}
                    filteredCount={sortedProducts.length}
                    totalCount={products.length}
                    currentCategory={filterBy.category || 'all'}
                    sortOrder={sortOrder}
                    onSortChange={(order) => { setSortOrder(order as 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'asc' | 'desc'); setPage(1); }}
                />
            )}

            {sortedProducts.length > 0 ? (
                <ProductList
                    products={sortedProducts}
                    page={page}
                    onPageChange={setPage}
                />
            ) : (
                <div className="no-products no-filter-results">
                    <p>{isEn ? 'No products match the selected filters.' : 'לא נמצאו מוצרים התואמים את הסינון.'}</p>
                    <button type="button" className="reset-filters-btn" onClick={onResetFilters}>
                        {isEn ? 'Clear all filters' : 'נקה את כל המסננים'}
                    </button>
                </div>
            )}
        </div>
    )
}
