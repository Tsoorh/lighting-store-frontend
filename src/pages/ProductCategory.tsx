import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { productService } from "../services/product.service"
import type { FullProduct } from "../model/product.model"
import { ProductList } from "../cmps/Product/ProductList"
import { ContactSection } from "../cmps/ContactSection"
import { useLanguage } from "../hooks/useLanguage"

export const ProductCategory = () => {
    const { categoryName } = useParams()
    const [products, setProducts] = useState<FullProduct[] | undefined>()
    const { language } = useLanguage()

    useEffect(() => {
        if (categoryName) {
            const getProducts = async () => {
                try {
                    // Map 'pendant' in URL back to 'hanging' for the DB query, 
                    // in case the database still uses 'hanging'.
                    const dbCategory = categoryName.toLowerCase() === 'pendant' ? 'hanging' : categoryName;
                    const filterBy = { category: dbCategory }
                    const productsFromDB = await productService.query(filterBy)
                    
                    if (Array.isArray(productsFromDB) && productsFromDB.length > 0) {
                        setProducts(productsFromDB)
                    } else {
                        setProducts(undefined)
                    }
                } catch (err) {
                    console.error('Failed to fetch products:', err)
                    setProducts(undefined)
                }
            }
            getProducts()
        }
    }, [categoryName])

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
            
            <section className="category-products-container">
                {products ? <ProductList products={products} /> : <div className="no-products">{isEnglish ? 'No products yet' : 'אין מוצרים כרגע'}</div>}
            </section>

            <ContactSection />
        </div>
    )
}