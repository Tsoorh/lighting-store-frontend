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
    const rawImgs = Array.isArray(product?.imgsUrl) ? product.imgsUrl : []
    const cleanUrls = rawImgs.map(url => url.replace(/[\r\n\s]+/g, '').replace(/\.[^/.]+$/, "").replace(/^4G8A/i, ""))
    const filteredUrls = cleanUrls.filter(url => url !== 'coming-soon')
    const cPhotos = filteredUrls.filter(url => url.toUpperCase().startsWith('C_'))
    const hPhotos = filteredUrls.filter(url => url.toUpperCase().startsWith('H_'))
    const numPhotos = filteredUrls.filter(url => !url.toUpperCase().startsWith('C_') && !url.toUpperCase().startsWith('H_') && !url.toUpperCase().startsWith('S_'))
    const sPhotos = filteredUrls.filter(url => url.toUpperCase().startsWith('S_'))

    // תמונה ראשית: כרטיס קטלוגי (C_), או הירו (H_), או תמונה ממוספרת, או שרטוט טכני
    const primaryImg = cPhotos[0] || hPhotos[0] || numPhotos[0] || sPhotos[0] || null

    const getImageUrl = (imgName: string) => {
        // const cloudId = import.meta.env.VITE_CLOUDINARY_ID
        const cloudId = 'dhixlriwm'
        const nameWithout4G8A = imgName.replace(/^4G8A/i, '')
        const upper = nameWithout4G8A.toUpperCase()
        if (upper.startsWith('C_') || upper.startsWith('H_') || upper.startsWith('S_')) return `https://res.cloudinary.com/${cloudId}/image/upload/${nameWithout4G8A}.webp`
        return `https://res.cloudinary.com/${cloudId}/image/upload/4G8A${nameWithout4G8A}.webp`
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
                <div className="product-preview-images">
                    <div className="ambient-light-bloom" aria-hidden="true" />
                    {primaryImg ? (
                        <div className="img-wrapper">
                            <ImageWithSkeleton src={getImageUrl(primaryImg)} alt={isEnglish ? product.name.en : product.name.he} loading="lazy" />
                        </div>
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
                    <div className="hover-view-pill" aria-hidden="true">
                        <span>{isEnglish ? 'View Piece' : 'צפה בפריט'}</span>
                    </div>
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
