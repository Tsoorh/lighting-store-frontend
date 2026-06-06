import { useEffect, useState } from "react"
import { productService } from "../../services/product.service"
import type { FilterBy, FullProductsOrNull } from "../../model/product.model"
import { ProductPreview } from "./ProductPreview"
import { SkeletonProductPreview } from "../Skeleton/SkeletonProductPreview"

type productIndexProps = {
    filterBy?: FilterBy
}

export const ProductIndex = ({ filterBy = {} }: productIndexProps) => {
    const [products, setProducts] = useState<FullProductsOrNull>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadProducts = async (): Promise<void> => {
            setIsLoading(true)
            try {
                const productsFromDB = await productService.query(filterBy)
                setProducts(productsFromDB)
            } catch (err) {
                console.error('Failed to load products:', err)
            } finally {
                setIsLoading(false)
            }
        }
        loadProducts()
    }, [])

    if (isLoading) {
        return (
            <div className="product-list">
                {[...Array(6)].map((_, i) => (
                    <SkeletonProductPreview key={i} />
                ))}
            </div>
        )
    }

    if (!products || products.length === 0) return "No products to show"

    return (
        <div className="product-list">
            {products.map(product => {
                return <ProductPreview key={product._id} product={product} />
            })}
        </div>
    )
}