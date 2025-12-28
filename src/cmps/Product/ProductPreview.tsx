import { useLanguage } from "../../hooks/useLanguage"
import type { FullProduct } from "../../model/product.model"

type ProductPreviewProp = {
    product: FullProduct
}

export const ProductPreview = ({ product }: ProductPreviewProp) => {
    const { language } = useLanguage()

    return (
        <div className="product-preview">
            <img src={product.imgsUrl[0] ? `https://res.cloudinary.com/dhixlriwm/image/upload/4G8A${product.imgsUrl[0]}.webp` : `https://res.cloudinary.com/dhixlriwm/image/upload/coming-soon.webp`} />
            <p>{language === "en" ? product.name.en : product.name.he} | {language === "en" ?product.woodType[0].en:product.woodType[0].he} |</p>
            <p>₪{product.price}</p>
        </div>
    )
}