
import React, { useEffect, useState } from "react"
import type { FullProductsOrNull } from "../../model/product.model"
import { productService } from "../../services/product.service"
import { ProductPreview } from "./ProductPreview"
import { useParams } from "react-router-dom"
import { useLanguage } from "../../hooks/useLanguage"


export const ProductSuggestion = ({ category }: { category: string }) => {
    const { productId } = useParams()
    const [products, setProducts] = useState<FullProductsOrNull | undefined>()
    const { language } = useLanguage()
    const isEnglish = language === 'en'


    useEffect(() => {
        if (category) {
            const getProducts = async () => {
                const filterBy = { category: category }
                const productsFromDB = await productService.query(filterBy)
                let productsToSet = null;
                if (productsFromDB) {
                    const filteredProducts = productsFromDB.filter(p => p._id !== productId)
                    const shuffledProducts = filteredProducts.sort(() => 0.5 - Math.random())
                    productsToSet = shuffledProducts.slice(0, 3)
                }
                setProducts(productsToSet)
            }
            getProducts()
        }
    }, [category, productId])

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
