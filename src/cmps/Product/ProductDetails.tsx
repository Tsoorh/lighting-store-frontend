import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { SkeletonProductDetails } from "../Skeleton/SkeletonProductDetails"
import type { FullProduct } from "../../model/product.model"
import { productService } from "../../services/product.service"
import { useLanguage } from "../../hooks/useLanguage"
import { Icons } from "../Icons"
import { ProductSuggestion } from "./ProductSuggestion"
import { ContactSection } from "../ContactSection"

export const ProductDetails = () => {
    const { productId } = useParams()
    const [product, setProduct] = useState<FullProduct | null>(null)
    const [gallery, setGallery] = useState<string[]>([])
    const [mainImage, setMainImage] = useState<string>('')
    const { language } = useLanguage()

    useEffect(() => {
        window.scrollTo(0, 0)
        
        const loadProduct = async (): Promise<void> => {
            if (!productId) return
            try {
                const productFromDb = await productService.getById(productId)
                setProduct(productFromDb);

                if (productFromDb && productFromDb.imgsUrl) {
                    const cleanUrls = productFromDb.imgsUrl.map((url: string) => url.replace(/[\r\n\s]+/g, "").replace(/\.[^/.]+$/, ""));
                    
                    // Plan 009: Ignore C_ photos, prioritize H_ photos
                    const validPhotos = cleanUrls.filter((url: string) => !url.startsWith('C_'));
                    const hPhotos = validPhotos.filter((url: string) => url.startsWith('H_'));
                    const otherPhotos = validPhotos.filter((url: string) => !url.startsWith('H_'));

                    const getImageUrl = (cleanName: string) => {
                        const cloudId = import.meta.env.VITE_CLOUDINARY_ID
                        if (cleanName === 'coming-soon') return `https://res.cloudinary.com/${cloudId}/image/upload/coming-soon.webp`
                        if (cleanName.startsWith('H_') || cleanName.startsWith('C_')) return `https://res.cloudinary.com/${cloudId}/image/upload/${cleanName}.webp`
                        return `https://res.cloudinary.com/${cloudId}/image/upload/4G8A${cleanName}.webp`
                    }

                    // Combine and take up to 5 photos (1 main + 4 thumbs)
                    const sortedPhotos = [...hPhotos, ...otherPhotos].slice(0, 5).map(getImageUrl);
                    
                    setGallery(sortedPhotos);
                    if (sortedPhotos.length > 0) setMainImage(sortedPhotos[0]);
                }
            } catch (err) {
                console.log("Error loading product:", err)
            }
        }
        loadProduct()
    }, [productId])

    if (!product) return <SkeletonProductDetails />

    const isEnglish = language === 'en'
    const nameLabel = isEnglish ? product.name.en : product.name.he
    const descriptionLabel = isEnglish ? product.description.en : product.description.he
    
    // Texts
    const descTitle = isEnglish ? 'Description' : 'תיאור'
    const specsTitle = isEnglish ? 'Technical Specifications' : 'מפרט טכני'
    const sizeTitle = isEnglish ? 'Dimensions' : 'מידות'
    const linkLabel = isEnglish ? 'Request a Quote' : 'בקשה להצעת מחיר'

    const materialsStr = product.material.map(m => isEnglish ? m.en : m.he).join(', ')
    const woodStr = product.woodType.map(w => isEnglish ? w.en : w.he).join(', ')
    const bulbStr = product.socketType?.screwType || ''
    const voltStr = product.socketType?.lightType || ''

    return (
        <div className={`product-details-page ${isEnglish ? 'ltr' : 'rtl'}`} dir={isEnglish ? 'ltr' : 'rtl'}>
            
            <div className="product-top-section">
                
                {/* RIGHT SIDE: INFO (Flex swaps this visually on LTR/RTL) */}
                <div className="product-info-container">
                    <div className="product-info-content">
                        <div className="product-title-wrapper">
                            <h1>{nameLabel}</h1>
                            {product.price !== undefined && (
                                <h2 className="product-price">
                                    ₪{product.price}
                                </h2>
                            )}
                        </div>

                        <div className="product-sections">
                            <div className="product-sec1">
                                <h3>{descTitle}</h3>
                                <p className="description">{descriptionLabel}</p>
                            </div>

                            <div className="product-sec2">
                                <h3>{specsTitle}</h3>
                                <ul className="specs-list">
                                    {woodStr && <li>{isEnglish ? 'Wood Type:' : 'סוג עץ:'} {woodStr}</li>}
                                    {materialsStr && <li>{isEnglish ? 'Materials:' : 'חומרים:'} {materialsStr}</li>}
                                    {voltStr && <li>{isEnglish ? 'Voltage:' : 'מתח:'} {voltStr}</li>}
                                    {bulbStr && <li>{isEnglish ? 'Bulb Type:' : 'סוג נורה:'} {bulbStr}</li>}
                                </ul>
                            </div>

                            <div className="product-sec3">
                                <h3>{sizeTitle}</h3>
                                <ul className="sizes-list">
                                    {product.size.map((s, idx) => {
                                        const parts = []
                                        if (isEnglish) {
                                            if (s.upTo) parts.push(`Up to ${s.upTo} cm`)
                                            if (s.diameter) parts.push(`Diameter ${s.diameter} cm`)
                                            if (s.length) parts.push(`Length ${s.length} cm`)
                                            if (s.width) parts.push(`Width ${s.width} cm`)
                                            if (s.height) parts.push(`Height ${s.height} cm`)
                                        } else {
                                            if (s.upTo) parts.push(`עד ל- ${s.upTo} ס"מ`)
                                            if (s.diameter) parts.push(`קוטר ${s.diameter} ס"מ`)
                                            if (s.length) parts.push(`אורך ${s.length} ס"מ`)
                                            if (s.width) parts.push(`רוחב ${s.width} ס"מ`)
                                            if (s.height) parts.push(`גובה ${s.height} ס"מ`)
                                        }
                                        return (
                                            <li key={idx}>
                                                {parts.join(', ')}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>

                            <div className="product-sec4">
                                <div className="term-box">
                                    <h4>{isEnglish ? 'Customization' : 'התאמה אישית'}</h4>
                                    <p>{isEnglish ? 'Dimensions and finishes can be customized.' : 'ניתן לשנות מידות וגימורים או לפתח דגם ייעודי לפרויקט.'}</p>
                                </div>
                                <div className="term-box">
                                    <h4>{isEnglish ? 'Production Time' : 'זמן ייצור'}</h4>
                                    <p>{isEnglish ? 'Made to order: up to 30 work days.' : 'בהזמנה: עד 30 ימי עבודה.'}</p>
                                </div>
                                <div className="term-box">
                                    <h4>{isEnglish ? 'Warranty' : 'אחריות'}</h4>
                                    <p>{isEnglish ? '1 year warranty on the fixture.' : 'שנה אחריות על גוף התאורה.'}</p>
                                </div>
                            </div>
                        </div>

                        <a href='https://wa.me/972524000102' target="_blank" rel="noopener noreferrer" className="quote-btn animated-link">
                            <span>{linkLabel}</span>
                            <Icons iconName={isEnglish ? 'next' : 'back'} />
                        </a>
                    </div>
                </div>

                {/* LEFT SIDE: GALLERY */}
                <div className="product-gallery-container">
                    <div className="gallery-top">
                        {mainImage ? (
                            <img src={mainImage} alt={nameLabel} className="main-image" />
                        ) : (
                            <div className="no-image-placeholder">No Image Available</div>
                        )}
                    </div>
                    <div className="gallery-bottom">
                        {gallery.map((imgUrl, idx) => (
                            <div 
                                key={idx} 
                                role="button"
                                tabIndex={0}
                                aria-label={`${isEnglish ? 'View image' : 'הצג תמונה'} ${idx + 1}`}
                                className={`thumbnail-wrapper ${mainImage === imgUrl ? 'active' : ''}`}
                                onClick={() => setMainImage(imgUrl)}
                                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setMainImage(imgUrl)}
                            >
                                <img src={imgUrl} alt={`${nameLabel} thumb ${idx}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="suggestion">
                <ProductSuggestion category={product.category[0].en} />
            </div>
            
            <ContactSection />
        </div>
    )
}