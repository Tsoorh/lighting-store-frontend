import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { productService } from "../services/product.service"
import type { FullProduct } from "../model/product.model"
import { ProductPreview } from "../cmps/Product/ProductPreview"

export const ProductCategory = () => {
    const { categoryName } = useParams()
    const [products, setProducts] = useState<FullProduct[] | undefined>()

    useEffect(() => {
        if (categoryName) {
            const getProducts = async () => {
                const filterBy = { category: categoryName }
                const productsFromDB = await productService.query(filterBy)
                if (productsFromDB && productsFromDB.length > 0) setProducts(productsFromDB)
            }
            getProducts()
        }
    }, [categoryName])

    if (!products) return "No products"
    return (
        <div className="category-layout">
            <div className="category-image">
                <h1>{categoryName?.toUpperCase()} LIGHTS</h1>
                <img src={`https://res.cloudinary.com/dhixlriwm/image/upload/4G8A${categoryName}.webp`} alt={categoryName} />
            </div>
            <div className="product-list">
            {products.map(product=>{
                return <ProductPreview product={product}/>
            })}
            </div>
        </div>
    )
}