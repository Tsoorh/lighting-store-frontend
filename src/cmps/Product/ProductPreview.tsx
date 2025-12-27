import type { FullProduct } from "../../model/product.model"

type ProductPreviewProp={
    product:FullProduct
}

export const ProductPreview = ({product}:ProductPreviewProp) => {
    
    return (
        <div>
            <h1>{}</h1>
            <img src={`https://res.cloudinary.com/dhixlriwm/image/upload/${product.imgUrl[0]}.webp`} alt={product.imgUrl[0]}/>
        </div>
    )
}