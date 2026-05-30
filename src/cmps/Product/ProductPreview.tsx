import { useRef } from "react"
import { useLanguage } from "../../hooks/useLanguage"
import type { FullProduct } from "../../model/product.model"
import { useNavigate } from "react-router-dom"
import { Icons } from "../Icons"

type ProductPreviewProp = {
    product: FullProduct
}

export const ProductPreview = ({ product }: ProductPreviewProp) => {
    const { language } = useLanguage()
    const navigate = useNavigate()
    const scrollRef = useRef<HTMLDivElement>(null)

    const onHandleClick = () => {
        navigate(`/product/${product._id}`)
    }

    const isEnglish = language === "en"

    // מנקים תווים נסתרים, רווחים וירידות שורות מכל השמות
    const cleanUrls = product.imgsUrl.map(url => url.replace(/[\r\n\s]+/g, ''))
    const cPhotos = cleanUrls.filter(url => url.startsWith('C_'))
    const displayPhotos = cPhotos.length > 0 ? cPhotos : cleanUrls
    const photosToRender = displayPhotos.length > 0 ? displayPhotos : ['coming-soon']

    const getImageUrl = (imgName: string) => {
        const cleanName = imgName.replace(/\.[^/.]+$/, "")
        if (cleanName === 'coming-soon') return `https://res.cloudinary.com/dhixlriwm/image/upload/coming-soon.webp`
        if (cleanName.startsWith('C_')) return `https://res.cloudinary.com/dhixlriwm/image/upload/${cleanName}.webp`
        return `https://res.cloudinary.com/dhixlriwm/image/upload/4G8A${cleanName}.webp`
    }

    const scroll = (direction: 'left' | 'right', ev: React.MouseEvent) => {
        ev.stopPropagation()
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current
            const scrollAmount = direction === 'left' ? -clientWidth : clientWidth
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    return (
        <div className="product-preview" onClick={onHandleClick}>
            <div className="product-preview-image-container">
                {photosToRender.length > 1 && (
                    <>
                        <button className="nav-btn prev" onClick={(e) => scroll('left', e)}><Icons iconName="left" /></button>
                        <button className="nav-btn next" onClick={(e) => scroll('right', e)}><Icons iconName="right" /></button>
                    </>
                )}
                <div className="product-preview-images" ref={scrollRef}>
                    {photosToRender.map((img, idx) => (
                        <div className="img-wrapper" key={idx}>
                            <img src={getImageUrl(img)} alt={isEnglish ? product.name.en : product.name.he} loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>
            <span className={`product-name ${isEnglish ? 'ltr' : 'rtl'}`}>
                {isEnglish ? product.name.en : product.name.he}
            </span>
        </div>
    )
}