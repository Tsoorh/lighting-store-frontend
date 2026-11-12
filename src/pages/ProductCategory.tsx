import { useEffect, useMemo, useState } from "react"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { productService } from "../services/product.service"
import { optionsService } from "../services/options.service"
import { ProductList } from "../cmps/Product/ProductList"
import { ProductFilter } from "../cmps/Product/ProductFilter"
import { ContactSection } from "../cmps/ContactSection"
import { useLanguage } from "../hooks/useLanguage"
import { SkeletonProductPreview } from "../cmps/Skeleton/SkeletonProductPreview"
import { authService } from "../services/auth.service"
import type { FullProduct, ProductFilterCriteria } from "../model/product.model"
import type { Miniuser } from "../model/user.model"
import { filterProducts, sortProducts } from "../utils/product-filters"

export const ProductCategory = () => {
    const { categoryName } = useParams()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const { language } = useLanguage()

    const { data: siteOptions } = useQuery({
        queryKey: ['site-options'],
        queryFn: () => optionsService.getSiteOptions(),
        staleTime: 1000 * 60 * 5
    })

    useEffect(() => {
        const catKey = categoryName?.toLowerCase() || ''
        if (catKey.includes('new') && siteOptions && siteOptions.isNewCollectionActive === false) {
            navigate('/product/category/all', { replace: true })
        }
    }, [categoryName, siteOptions, navigate])

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
            if (categoryName.toLowerCase() === 'new-collection' || categoryName.toLowerCase() === 'new') {
                const res = await productService.query({ category: 'new-collection' })
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
    } else if (categoryKey.includes('new')) {
        titleHe = 'קולקציה חדשה'
        titleEn = 'New Collection'
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

    // Multi-facet filtering & sorting logic
    const filteredProducts = useMemo(
        () => filterProducts(products, filters),
        [products, filters]
    )

    const sortedProducts = useMemo(
        () => sortProducts(filteredProducts, sortOrder, isEnglish),
        [filteredProducts, sortOrder, isEnglish]
    )

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
