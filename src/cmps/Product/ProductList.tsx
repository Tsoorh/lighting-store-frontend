import { useEffect, useState } from "react"
import type { FullProduct } from "../../model/product.model"
import { ProductPreview } from "./ProductPreview"
import { Pagination } from "@heroui/pagination"

type Products = {
    products: FullProduct[]
}

export const ProductList = ({ products }: Products) => {
    const [page, setPage] = useState(1)
    const [prevProducts, setPrevProducts] = useState(products)
    const itemsPerPage = 9

    // גלילה אוטומטית למעלה כשעוברים עמוד
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [page])

    if (!Array.isArray(products)) {
        console.error('ProductList: products prop is not an array!', products)
        return <div className="error">Error: products is not an array</div>
    }

    const totalPages = Math.ceil(products.length / itemsPerPage)

    // איפוס לעמוד הראשון כאשר עוברים קטגוריה
    if (products !== prevProducts) {
        setPage(1)
        setPrevProducts(products)
    }

    const startIdx = (page - 1) * itemsPerPage
    const endIdx = startIdx + itemsPerPage
    const displayProducts = products.slice(startIdx, endIdx)
    
    return (
        <>
            <div className="product-list">

                {displayProducts.map(product => {
                    return <ProductPreview product={product} key={product._id}/>
                })}
            </div>
            {totalPages > 1 && (
                <div className="pagination-wrapper" style={{ display: 'flex', justifyContent: 'center', marginTop: '64px', direction: 'ltr' }}>
                    <Pagination 
                        total={totalPages} 
                        page={page} 
                        onChange={setPage} 
                        showControls
                    />
                </div>
            )}
        </>
    )
}