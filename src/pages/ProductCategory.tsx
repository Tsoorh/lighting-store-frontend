import { useMemo, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { productService } from "../services/product.service"
import { ProductList } from "../cmps/Product/ProductList"
import { ContactSection } from "../cmps/ContactSection"
import { useLanguage } from "../hooks/useLanguage"
import { SkeletonProductPreview } from "../cmps/Skeleton/SkeletonProductPreview"

export const ProductCategory = () => {
    const { categoryName } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const { language } = useLanguage()

    const page = parseInt(searchParams.get('page') || '1')

    const { data: products, isLoading } = useQuery({
        queryKey: ['products', 'category', categoryName],
        queryFn: () => {
            if (!categoryName) return []
            const dbCategory = categoryName.toLowerCase() === 'pendant' ? 'hanging' : categoryName
            return productService.query({ category: dbCategory })
        },
        enabled: !!categoryName,
        select: (data) => Array.isArray(data) ? data : []
    })

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

    const isEnglish = language === 'en'
    const categoryKey = categoryName?.toLowerCase() || ''
    
    let titleHe = 'גופי תאורה'
    let titleEn = 'Lighting'
    let imgName = 'Header_Pendant.png'

    if (categoryKey.includes('wall')) {
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

    const sortedProducts = useMemo(() => {
        return [...(products || [])].sort((a, b) => {
            const nameA = (isEnglish ? a.name?.en : a.name?.he) || ''
            const nameB = (isEnglish ? b.name?.en : b.name?.he) || ''
            const comparison = nameA.localeCompare(nameB, isEnglish ? 'en' : 'he')
            return sortOrder === 'asc' ? comparison : -comparison
        })
    }, [products, sortOrder, isEnglish])

    return (
        <div className="product-category-page">
            <section className={`category-strip ${isEnglish ? 'ltr' : 'rtl'}`}>
                <div className="strip-text-container">
                    <div className="strip-line"></div>
                    <h1>{title}</h1>
                </div>
                <div className="strip-image-container">
                    <img src={`/images/Figma/${imgName}`} alt={title} />
                </div>
            </section>
            
            <section className={`category-products-container ${isEnglish ? 'ltr' : 'rtl'}`}>
                <div className={`sort-container ${isEnglish ? 'ltr' : 'rtl'}`}>
                    <label htmlFor="sortOrder">{isEnglish ? 'Sort by:' : 'מיון לפי:'}</label>
                    <select 
                        id="sortOrder" 
                        value={sortOrder} 
                        onChange={(e) => {
                            setSortOrder(e.target.value as 'asc' | 'desc')
                            onPageChange(1) // Reset to page 1 on sort change
                        }}
                    >
                        <option value="asc">{isEnglish ? 'A-Z' : 'א-ת'}</option>
                        <option value="desc">{isEnglish ? 'Z-A' : 'ת-א'}</option>
                    </select>
                </div>

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