import { useRef, useState } from "react"
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
    const [currentIndex, setCurrentIndex] = useState(0)

    const onHandleClick = () => {
        navigate(`/product/${product._id}`)
    }

    const isEnglish = language === "en"

    // מנקים תווים נסתרים, רווחים וירידות שורות מכל השמות
    const cleanUrls = product.imgsUrl.map(url => url.replace(/[\r\n\s]+/g, ''))
    const cPhotos = cleanUrls.filter(url => url.startsWith('C_'))
    const hPhotos = cleanUrls.filter(url => url.startsWith('H_'))
    const numPhotos = cleanUrls.filter(url => !url.startsWith('C_') && !url.startsWith('H_'))
    
    let displayPhotos = cPhotos.length > 0 ? cPhotos : hPhotos
    if (displayPhotos.length === 0) displayPhotos = numPhotos

    const photosToRender = displayPhotos.length > 0 ? displayPhotos : ['coming-soon']

    const getImageUrl = (imgName: string) => {
        const cleanName = imgName.replace(/\.[^/.]+$/, "")
        if (cleanName === 'coming-soon') return `https://res.cloudinary.com/dhixlriwm/image/upload/coming-soon.webp`
        if (cleanName.startsWith('C_') || cleanName.startsWith('H_')) return `https://res.cloudinary.com/dhixlriwm/image/upload/${cleanName}.webp`
        return `https://res.cloudinary.com/dhixlriwm/image/upload/4G8A${cleanName}.webp`
    }

    const handleScroll = () => {
        if (!scrollRef.current) return
        const { scrollLeft, clientWidth } = scrollRef.current
        if (clientWidth === 0) return
        const newIndex = Math.round(Math.abs(scrollLeft) / clientWidth)
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex)
        }
    }

    const canScrollLeft = currentIndex > 0
    const canScrollRight = currentIndex < photosToRender.length - 1

    const scroll = (direction: 'left' | 'right', ev: React.MouseEvent) => {
        ev.stopPropagation()
        ev.preventDefault()
        if ((direction === 'left' && !canScrollLeft) || (direction === 'right' && !canScrollRight)) return
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current
            const scrollAmount = direction === 'left' ? -clientWidth : clientWidth
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    return (
        <div 
            className="product-preview" 
            role="link" 
            tabIndex={0} 
            onClick={onHandleClick}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onHandleClick()}
            aria-label={`${isEnglish ? 'View product:' : 'צפה במוצר:'} ${isEnglish ? product.name.en : product.name.he}`}
        >
            <div className="product-preview-image-container">
                {photosToRender.length > 1 && (
                    <>
                        <button className={`nav-btn prev ${!canScrollLeft ? 'inactive' : ''}`} onClick={(e) => scroll('left', e)} aria-label={isEnglish ? 'Previous image' : 'תמונה קודמת'} tabIndex={-1}>
                            <Icons iconName="left" />
                        </button>
                        <button className={`nav-btn next ${!canScrollRight ? 'inactive' : ''}`} onClick={(e) => scroll('right', e)} aria-label={isEnglish ? 'Next image' : 'תמונה הבאה'} tabIndex={-1}>
                            <Icons iconName="right" />
                        </button>
                    </>
                )}
                <div className="product-preview-images" ref={scrollRef} onScroll={handleScroll}>
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