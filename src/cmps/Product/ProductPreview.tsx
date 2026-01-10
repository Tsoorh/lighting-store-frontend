import { useLanguage } from "../../hooks/useLanguage"
import { useObserver } from "../../hooks/useObserver"
import { useState } from "react"
import type { FullProduct } from "../../model/product.model"
import { useWindowWidth } from "../../hooks/useWindowWidth"
import { useNavigate } from "react-router-dom"

type ProductPreviewProp = {
    product: FullProduct
}

export const ProductPreview = ({ product }: ProductPreviewProp) => {
    const { language } = useLanguage()
    const [isVisible, setIsVisible] = useState(false)
    const width = useWindowWidth()
    const navigate = useNavigate()

    const ref = useObserver((isIntersecting) => {
        setIsVisible(isIntersecting)
    })

    const onHandleClick = () => {
        navigate(`/product/${product._id}`)
    }
    const isEnglish = language === "en"
    const isMobile = width <= 400
    const alignLang = isEnglish ? 'self-start' : 'self-end'
    // style={{ opacity: isVisible ? 1 : 0 }}
    return (
        <div className="product-preview" onClick={onHandleClick} ref={ref} >
            <img
                className={isMobile && isVisible ? 'visible' : ''}
                src={product.imgsUrl[0] ? `https://res.cloudinary.com/dhixlriwm/image/upload/4G8A${product.imgsUrl[0]}.webp` : `https://res.cloudinary.com/dhixlriwm/image/upload/coming-soon.webp`}
            />
            <span style={{ alignSelf: alignLang }}><b>{isEnglish ? product.name.en : product.name.he}</b></span>
            <span style={{ alignSelf: alignLang }}>₪{product.price}</span>
            {/* <button className="btn-preview" style={{ alignSelf: alignLang }}>{isEnglish?'More details':'לפרטים נוספים'}</button> */}
        </div>
    )
}