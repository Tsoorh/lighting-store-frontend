import type { FullProduct } from "../../model/product.model"
import { ProductPreview } from "./ProductPreview"

type Products = {
    products: FullProduct[]
}

export const ProductList = ({ products }: Products) => {

    return (
        <div className="product-list">
            {products.map(product => {
                return <ProductPreview product={product} key={product._id}/>
            })}
        </div>
    )
}