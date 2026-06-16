import { useRef, useState } from "react"
import { useLanguage } from "../../hooks/useLanguage"
import type { FullProduct } from "../../model/product.model"
import { useNavigate } from "react-router-dom"
import { Icons } from "../Icons"
import { ImageWithSkeleton } from "../Skeleton/ImageWithSkeleton"
import { authService } from "../../services/auth.service"

type ProductPreviewProp = {
    product: FullProduct
}

export const ProductPreview = ({ product }: ProductPreviewProp) => {
    const { language } = useLanguage()
    const navigate = useNavigate()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const user = authService.getLoggedinUser()
    const isAdmin = user?.role?.trim().toLowerCase() === 'admin'

    const onHandleClick = () => {
        navigate(`/product/${product._id}`)
    }

    const onEditProduct = (ev: React.MouseEvent) => {
        ev.stopPropagation()
        ev.preventDefault()
        navigate(`/dashboard?edit=${product._id}`)
    }

    const isEnglish = language === "en"

    // מנקים תווים נסתרים, רווחים וירידות שורות מכל השמות
    const cleanUrls = product.imgsUrl.map(url => url.replace(/[\r\n\s]+/g, '').replace(/\.[^/.]+$/, ""))
    const filteredUrls = cleanUrls.filter(url => url !== 'coming-soon')
    const cPhotos = filteredUrls.filter(url => url.startsWith('C_'))
    const hPhotos = filteredUrls.filter(url => url.startsWith('H_'))
    const numPhotos = filteredUrls.filter(url => !url.startsWith('C_') && !url.startsWith('H_'))

    const photosToRender = cPhotos.length > 0 ? cPhotos : (hPhotos.length > 0 ? hPhotos : numPhotos)

    const getImageUrl = (imgName: string) => {
        // const cloudId = import.meta.env.VITE_CLOUDINARY_ID
        const cloudId = 'dhixlriwm'
        if (imgName.startsWith('C_') || imgName.startsWith('H_')) return `https://res.cloudinary.com/${cloudId}/image/upload/${imgName}.webp`
        return `https://res.cloudinary.com/${cloudId}/image/upload/4G8A${imgName}.webp`
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
            // In RTL, "next" (right button) should scroll left (negative)
            // In LTR, "next" (right button) should scroll right (positive)
            let scrollAmount = direction === 'left' ? -clientWidth : clientWidth
            if (!isEnglish) scrollAmount = -scrollAmount
            
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
                {isAdmin && (
                    <button className="admin-edit-btn" onClick={onEditProduct} title={isEnglish ? 'Edit Product' : 'ערוך מוצר'}>
                        <Icons iconName="edit" />
                    </button>
                )}
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
                    {photosToRender.length > 0 ? (
                        photosToRender.map((img, idx) => (
                            <div className="img-wrapper" key={idx}>
                                <ImageWithSkeleton src={getImageUrl(img)} alt={isEnglish ? product.name.en : product.name.he} loading="lazy" />
                            </div>
                        ))
                    ) : (
                        <div className="no-image-placeholder-preview" style={{ 
                            width: '100%', 
                            aspectRatio: '1/1', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            backgroundColor: '#f4f4f4',
                            color: '#666',
                            fontSize: '14px',
                            textAlign: 'center',
                            padding: '20px'
                        }}>
                            {isEnglish ? 'No photo available' : 'אין תמונה זמינה'}
                        </div>
                    )}
                </div>
            </div>
            <span className={`product-name ${isEnglish ? 'ltr' : 'rtl'}`}>
                {isEnglish ? product.name.en : product.name.he}
            </span>
            {product.price !== undefined && Array.isArray(product.price) && product.price.some(p => p.amount !== undefined) && (
                <span className={`product-price-preview ${isEnglish ? 'ltr' : 'rtl'}`} dir="ltr">
                    {(() => {
                        const amounts = product.price.filter(p => p.amount !== undefined).map(p => p.amount as number)
                        const min = Math.min(...amounts)
                        const max = Math.max(...amounts)
                        if (min === max) return `₪${min}`
                        return `₪${min} - ₪${max}`
                    })()}
                </span>
            )}
        </div>
    )
}