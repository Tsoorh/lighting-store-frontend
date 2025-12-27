import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { SkeletonProductDetails } from "../Skeleton/SkeletonProductDetails"
import type { FullProduct } from "../../model/product.model"
import { productService } from "../../services/product.service"

export const ProductDetails = () => {
    const { productId } = useParams()
    const [product, setProduct] = useState<FullProduct | null>(null)



    useEffect(() => {
        const loadProduct = async (): Promise<void> => {
            if (!productId) return
            try {
                const productFromDb = await productService.getById(productId)
                setProduct(productFromDb);
            } catch (err) {
                console.log("Error loading product:", err)
            }
        }
        loadProduct()
    }, [productId])




    if (!product) return <SkeletonProductDetails />
    return (
        <div className="product-details">
            <h1>Product Name</h1>
        </div>
    )
}