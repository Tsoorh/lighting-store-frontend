import { useLanguage } from "../../hooks/useLanguage"
import type { FullProduct } from "../../model/product.model"
import { useNavigate } from "react-router-dom"
import { Icons } from "../Icons"
import { ImageWithSkeleton } from "../Skeleton/ImageWithSkeleton"
import { authService } from "../../services/auth.service"
import { buildCloudinaryImageUrl, pickPrimaryProductImage } from "../../utils/cloudinary"
import { formatProductPriceRange, isProductNew } from "../../utils/product-filters"

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
    const isNew = isProductNew(product)
    const primaryImg = pickPrimaryProductImage(product?.imgsUrl)
    const priceRangeLabel = formatProductPriceRange(product?.price)

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
                {isNew && (
                    <span 
                        className="product-new-badge" 
                        dir={isEnglish ? "ltr" : "rtl"}
                        aria-label={isEnglish ? "New Product!" : "מוצר חדש!"}
                    >
                        {isEnglish ? 'NEW!' : 'חדש!'}
                    </span>
                )}
                <div className="product-preview-images">
                    <div className="ambient-light-bloom" aria-hidden="true" />
                    {primaryImg ? (
                        <div className="img-wrapper">
                            <ImageWithSkeleton src={buildCloudinaryImageUrl(primaryImg)} alt={isEnglish ? product.name.en : product.name.he} loading="lazy" />
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
            {priceRangeLabel && (
                <span className={`product-price-preview ${isEnglish ? 'ltr' : 'rtl'}`} dir="ltr">
                    {priceRangeLabel}
                </span>
            )}
        </div>
    )
}
