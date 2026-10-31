import { useEffect, useMemo, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { productService } from "../services/product.service"
import { ProductList } from "../cmps/Product/ProductList"
import { ProductFilter } from "../cmps/Product/ProductFilter"
import { ContactSection } from "../cmps/ContactSection"
import { useLanguage } from "../hooks/useLanguage"
import { SkeletonProductPreview } from "../cmps/Skeleton/SkeletonProductPreview"
import { authService } from "../services/auth.service"
import type { FullProduct, ProductFilterCriteria } from "../model/product.model"
import type { Miniuser } from "../model/user.model"

export const ProductCategory = () => {
    const { categoryName } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const { language } = useLanguage()

    // Logged-in user state to conditionally enable price range filter
    const [user, setUser] = useState<Miniuser | null>(() => authService.getLoggedinUser())

    useEffect(() => {
        const onUserChanged = () => setUser(authService.getLoggedinUser())
        window.addEventListener('user-changed', onUserChanged)
        return () => window.removeEventListener('user-changed', onUserChanged)
    }, [])

    const canSeePrices = !!user && user.showPrices !== false

    // Sync sortOrder and page from URL searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const sortOrder = (searchParams.get('sort') || 'name-asc') as 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'asc' | 'desc'

    // Parse filters from URL searchParams
    const filters: ProductFilterCriteria = useMemo(() => {
        const txt = searchParams.get('search') || undefined
        const cat = searchParams.get('cat')?.split(',').filter(Boolean)
        const material = searchParams.get('material')?.split(',').filter(Boolean)
        const wood = searchParams.get('wood')?.split(',').filter(Boolean)
        const socket = searchParams.get('socket')?.split(',').filter(Boolean)
        const minPriceStr = searchParams.get('minPrice')
        const maxPriceStr = searchParams.get('maxPrice')

        return {
            txt,
            category: cat && cat.length > 0 ? cat : undefined,
            material: material && material.length > 0 ? material : undefined,
            woodType: wood && wood.length > 0 ? wood : undefined,
            screwType: socket && socket.length > 0 ? socket : undefined,
            minPrice: minPriceStr && !isNaN(+minPriceStr) ? +minPriceStr : undefined,
            maxPrice: maxPriceStr && !isNaN(+maxPriceStr) ? +maxPriceStr : undefined
        }
    }, [searchParams])

    const { data: products, isLoading } = useQuery<FullProduct[]>({
        queryKey: ['products', 'category', categoryName],
        queryFn: async () => {
            if (!categoryName) return []
            if (categoryName.toLowerCase() === 'all') {
                const res = await productService.query({})
                return (res as FullProduct[]) || []
            }
            const dbCategory = categoryName.toLowerCase() === 'pendant' ? 'hanging' : categoryName
            const res = await productService.query({ category: dbCategory })
            return (res as FullProduct[]) || []
        },
        enabled: !!categoryName,
        select: (data) => Array.isArray(data) ? data : []
    })

    useEffect(() => {
        if (!isLoading && products) {
            const scrollPos = sessionStorage.getItem(`scroll-pos-${categoryName}`)
            if (scrollPos) {
                window.scrollTo(0, parseInt(scrollPos))
            }
        }
    }, [isLoading, categoryName, products])

    useEffect(() => {
        const handleScroll = () => {
            sessionStorage.setItem(`scroll-pos-${categoryName}`, window.scrollY.toString())
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [categoryName])

    const onPageChange = (newPage: number) => {
        setSearchParams(prev => {
            if (newPage === 1) {
                prev.delete('page')
            } else {
                prev.set('page', newPage.toString())
            }
            return prev
        })
    }

    const onSortChange = (newSort: string) => {
        setSearchParams(prev => {
            if (newSort === 'name-asc' || newSort === 'asc') {
                prev.delete('sort')
            } else {
                prev.set('sort', newSort)
            }
            prev.delete('page') // Reset to page 1 on sort change
            return prev
        })
    }

    const onFilterChange = (newFilters: ProductFilterCriteria) => {
        setSearchParams(prev => {
            // Text Search
            if (newFilters.txt) {
                prev.set('search', newFilters.txt)
            } else {
                prev.delete('search')
            }

            // Categories
            if (newFilters.category && newFilters.category.length > 0) {
                prev.set('cat', newFilters.category.join(','))
            } else {
                prev.delete('cat')
            }

            // Materials
            if (newFilters.material && newFilters.material.length > 0) {
                prev.set('material', newFilters.material.join(','))
            } else {
                prev.delete('material')
            }

            // Wood Types
            if (newFilters.woodType && newFilters.woodType.length > 0) {
                prev.set('wood', newFilters.woodType.join(','))
            } else {
                prev.delete('wood')
            }

            // Socket / Screw Types
            if (newFilters.screwType && newFilters.screwType.length > 0) {
                prev.set('socket', newFilters.screwType.join(','))
            } else {
                prev.delete('socket')
            }

            // Price range
            if (newFilters.minPrice !== undefined) {
                prev.set('minPrice', newFilters.minPrice.toString())
            } else {
                prev.delete('minPrice')
            }

            if (newFilters.maxPrice !== undefined) {
                prev.set('maxPrice', newFilters.maxPrice.toString())
            } else {
                prev.delete('maxPrice')
            }

            // Reset page to 1 whenever filters change
            prev.delete('page')
            return prev
        })
    }

    const onResetFilters = () => {
        setSearchParams(prev => {
            prev.delete('search')
            prev.delete('cat')
            prev.delete('material')
            prev.delete('wood')
            prev.delete('socket')
            prev.delete('minPrice')
            prev.delete('maxPrice')
            prev.delete('page')
            return prev
        })
    }

    const isEnglish = language === 'en'
    const categoryKey = categoryName?.toLowerCase() || ''
    
    let titleHe = 'גופי תאורה'
    let titleEn = 'Lighting'
    let imgName: string | null = 'Header_Pendant.png'

    if (categoryKey === 'all') {
        titleHe = 'כל גופי התאורה'
        titleEn = 'All Lighting Fixtures'
        imgName = null
    } else if (categoryKey.includes('wall')) {
        titleHe = 'גופי תאורה לקיר'
        titleEn = 'Wall Lights'
        imgName = 'Header_Wall.png'
    } else if (categoryKey.includes('ceiling')) {
        titleHe = 'גופי תאורה צמודי תקרה'
        titleEn = 'Ceiling Lights'
        imgName = 'Header_Ceiling.png'
    } else if (categoryKey.includes('pendant') || categoryKey.includes('hanging')) {
        titleHe = 'גופי תאורה תלויים'
        titleEn = 'Pendant Lights'
        imgName = 'Header_Pendant.png'
    }

    const title = isEnglish ? titleEn : titleHe

    // Multi-facet filtering logic
    const filteredProducts = useMemo(() => {
        if (!products || !Array.isArray(products)) return []

        return products.filter(product => {
            // 1. Text Search across Hebrew and English names and descriptions
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

            // 2. Category Filter (for subcategories on All page or cross-selection)
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

            // 3. Material Filter (Wood, Metal, Glass, Marble)
            if (filters.material && filters.material.length > 0) {
                const prodMats = (product.material || []).map(m => m.en.toLowerCase())
                const hasMat = filters.material.some(m => prodMats.includes(m.toLowerCase()))
                if (!hasMat) return false
            }

            // 4. Wood Type Filter
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

            // 5. Socket / Screw Type Filter (Strict exact equality, no partial substring leakage)
            if (filters.screwType && filters.screwType.length > 0) {
                const prodScrew = (product.socketType?.screwType || '').trim().toLowerCase()
                if (!prodScrew) return false
                const hasScrew = filters.screwType.some(s => prodScrew === s.trim().toLowerCase())
                if (!hasScrew) return false
            }

            // 6. Price Range Filter (if prices are active and set)
            if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
                if (!product.price || !Array.isArray(product.price) || product.price.length === 0) {
                    return false
                }
                const amounts = product.price.filter(pr => pr.amount !== undefined).map(pr => pr.amount)
                if (amounts.length === 0) return false
                const minAmount = Math.min(...amounts)
                const maxAmount = Math.max(...amounts)

                if (filters.minPrice !== undefined && maxAmount < filters.minPrice) return false
                if (filters.maxPrice !== undefined && minAmount > filters.maxPrice) return false
            }

            return true
        })
    }, [products, filters])

    // Sort the filtered products
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

            const nameA = (isEnglish ? a.name?.en : a.name?.he) || ''
            const nameB = (isEnglish ? b.name?.en : b.name?.he) || ''
            const comparison = nameA.localeCompare(nameB, isEnglish ? 'en' : 'he')
            return (sortOrder === 'desc' || sortOrder === 'name-desc') ? -comparison : comparison
        })
    }, [filteredProducts, sortOrder, isEnglish])

    const totalProductCount = products?.length || 0
    const filteredProductCount = sortedProducts.length
    const hasActiveFilters = !!(
        filters.txt || 
        filters.category?.length || 
        filters.material?.length || 
        filters.woodType?.length || 
        filters.screwType?.length || 
        filters.minPrice !== undefined || 
        filters.maxPrice !== undefined
    )

    return (
        <div className="product-category-page">
            <section className={`category-strip ${isEnglish ? 'ltr' : 'rtl'}`}>
                <div className="strip-text-container">
                    <div className="strip-line"></div>
                    <h1>{title}</h1>
                </div>
                {imgName && (
                    <div className="strip-image-container">
                        <img src={`/images/Figma/${imgName}`} alt={title} />
                    </div>
                )}
            </section>
            
            <section className={`category-products-container ${isEnglish ? 'ltr' : 'rtl'}`}>
                {/* Product Filter Toolbar */}
                <ProductFilter
                    filters={filters}
                    onFilterChange={onFilterChange}
                    onResetFilters={onResetFilters}
                    products={products || []}
                    filteredCount={filteredProductCount}
                    totalCount={totalProductCount}
                    currentCategory={categoryKey}
                    sortOrder={sortOrder}
                    onSortChange={onSortChange}
                    showPriceFilter={canSeePrices}
                />

                {isLoading ? (
                    <div className="product-list">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonProductPreview key={i} />
                        ))}
                    </div>
                ) : sortedProducts.length > 0 ? (
                    <ProductList 
                        products={sortedProducts} 
                        page={page} 
                        onPageChange={onPageChange}
                    />
                ) : hasActiveFilters ? (
                    <div className="no-products no-filter-results">
                        <p>{isEnglish ? 'No products match the selected filters.' : 'לא נמצאו גופי תאורה התואמים את הסינון שנבחר.'}</p>
                        <button 
                            type="button" 
                            className="reset-filters-btn"
                            onClick={onResetFilters}
                        >
                            {isEnglish ? 'Clear all filters' : 'נקה את כל המסננים'}
                        </button>
                    </div>
                ) : (
                    <div className="no-products">
                        {isEnglish ? 'No products yet' : 'אין מוצרים כרגע'}
                    </div>
                )}
            </section>

            <ContactSection />
        </div>
    )
}
