
import { useEffect, useState } from "react"
import type { FullProductsOrNull } from "../../model/product.model"
import { productService } from "../../services/product.service"
import { ProductPreview } from "./ProductPreview"
import { useParams } from "react-router-dom"
import { useLanguage } from "../../hooks/useLanguage"
import { SkeletonProductPreview } from "../Skeleton/SkeletonProductPreview"


export const ProductSuggestion = ({ category }: { category: string }) => {
    const { productId } = useParams()
    const [products, setProducts] = useState<FullProductsOrNull | undefined>()
    const [isLoading, setIsLoading] = useState(true)
    const { language } = useLanguage()
    const isEnglish = language === 'en'


    useEffect(() => {
        if (category) {
            const getProducts = async () => {
                setIsLoading(true)
                try {
                    const filterBy = { category: category }
                    const productsFromDB = await productService.query(filterBy)
                    let productsToSet = null;
                    if (productsFromDB) {
                        const filteredProducts = productsFromDB.filter(p => p._id !== productId)
                        const shuffledProducts = filteredProducts.sort(() => 0.5 - Math.random())
                        productsToSet = shuffledProducts.slice(0, 4)
                    }
                    setProducts(productsToSet)
                } catch (err) {
                    console.error('Failed to load suggestions:', err)
                } finally {
                    setIsLoading(false)
                }
            }
            getProducts()
        }
    }, [category, productId])

    if (isLoading) {
        return (
            <div className={`product-suggestion-sec ${isEnglish ? 'ltr' : 'rtl'}`}>
                <div className="suggestion-header">
                    <h2>{isEnglish ? 'Continue Discovering' : 'המשיכו לגלות'}</h2>
                </div>
                <div className="suggestion-carousel-container">
                    <ul className="suggestion-list">
                        {[...Array(3)].map((_, i) => (
                            <li key={i}><SkeletonProductPreview /></li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }

    if (!products || products.length === 0) return <p>{isEnglish ? 'No products to suggest' : 'אין מוצרים נוספים'}</p>
    return (
        <div className={`product-suggestion-sec ${isEnglish ? 'ltr' : 'rtl'}`}>
            <div className="suggestion-header">
                <h2>{isEnglish ? 'Continue Discovering' : 'המשיכו לגלות'}</h2>
            </div>
            
            <div className="suggestion-carousel-container">
                <ul className="suggestion-list">
                    {products.map((product) => (
                        <li key={product._id} ><ProductPreview product={product} /></li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
