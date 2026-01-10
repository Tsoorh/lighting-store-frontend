import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { productService } from "../services/product.service"
import type { FullProduct } from "../model/product.model"
import { ProductList } from "../cmps/Product/ProductList"

export const ProductCategory = () => {
    const { categoryName } = useParams()
    const [products, setProducts] = useState<FullProduct[] | undefined>()

    useEffect(() => {
        if (categoryName) {
            const getProducts = async () => {
                const filterBy = { category: categoryName }
                const productsFromDB = await productService.query(filterBy)
                if (productsFromDB && productsFromDB.length > 0) setProducts(productsFromDB)
                else (setProducts(undefined))
            }
            getProducts()
        }
    }, [categoryName])


    const categoryUpper = categoryName?.toUpperCase()
    const isAccessories = categoryUpper === 'ACCESSORIES' ? '' : 'LIGHTS'
    return (
        <div className="category-layout">
            <div className="category-image">
                <h1>{categoryUpper} {isAccessories}</h1>
                {/* <img src={`https://res.cloudinary.com/dhixlriwm/image/upload/4G8A${categoryName}.webp`} alt={categoryName} /> */}
                <img src={`../../public/images/${categoryName}-cover.jpeg`} alt={categoryName} />
            </div>
            {products ? <ProductList products={products} /> : 'No products yet'}
        </div>
    )
}