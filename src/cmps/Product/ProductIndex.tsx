import { useQuery } from "@tanstack/react-query"
import { productService } from "../../services/product.service"
import type { FilterBy } from "../../model/product.model"
import { ProductPreview } from "./ProductPreview"
import { SkeletonProductPreview } from "../Skeleton/SkeletonProductPreview"

type productIndexProps = {
    filterBy?: FilterBy
}

export const ProductIndex = ({ filterBy = {} }: productIndexProps) => {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products', filterBy],
        queryFn: () => productService.query(filterBy),
        select: (data) => Array.isArray(data) ? data : []
    })

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