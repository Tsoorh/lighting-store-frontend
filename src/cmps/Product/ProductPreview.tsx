import { useLanguage } from "../../hooks/useLanguage"
import { useObserver } from "../../hooks/useObserver"
import { useState } from "react"
import type { FullProduct } from "../../model/product.model"
import { useWindowWidth } from "../../hooks/useWindowWidth"

type ProductPreviewProp = {
    product: FullProduct
}

export const ProductPreview = ({ product }: ProductPreviewProp) => {
    const { language } = useLanguage()
    const [isVisible, setIsVisible] = useState(false)
    const width = useWindowWidth()

    const ref = useObserver((isIntersecting) => {
        setIsVisible(isIntersecting)
    })

    const isMobile = width <= 768
    // style={{ opacity: isVisible ? 1 : 0 }}
    return (
        <div className="product-preview" ref={ref}>
            <img
                className={isMobile && isVisible ? 'visible' : ''}
                src={product.imgsUrl[0] ? `https://res.cloudinary.com/dhixlriwm/image/upload/4G8A${product.imgsUrl[0]}.webp` : `https://res.cloudinary.com/dhixlriwm/image/upload/coming-soon.webp`}
            />
            <span>{language === "en" ? product.name.en : product.name.he}</span>
            <span>₪{product.price}</span>
        </div>
    )
}