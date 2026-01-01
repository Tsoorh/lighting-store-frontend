import { useEffect, useState } from "react"
import { productService } from "../../services/product.service"
import type { FilterBy, FullProductsOrNull } from "../../model/product.model"
import { ProductPreview } from "./ProductPreview"

type productIndexProps = {
    filterBy?: FilterBy
}

export const ProductIndex = ({ filterBy = {} }: productIndexProps) => {
    const [products, setProducts] = useState<FullProductsOrNull>(null)

    useEffect(() => {
        const loadProducts = async (): Promise<void> => {
            const productsFromDB = await productService.query(filterBy)
            setProducts(productsFromDB)
        }
        loadProducts()
    }, [])
    if (!products) return "No products to show"
    return (
        <div>
            {products.map(product => {
                return <ProductPreview key={product._id} product={product} />
            })}
        </div>
    )
}