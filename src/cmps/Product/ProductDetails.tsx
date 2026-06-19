import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { SkeletonProductDetails } from "../Skeleton/SkeletonProductDetails"
import { ImageWithSkeleton } from "../Skeleton/ImageWithSkeleton"
import type { FullProduct } from "../../model/product.model"
import { productService } from "../../services/product.service"
import { useLanguage } from "../../hooks/useLanguage"
import { Icons } from "../Icons"
import { ProductSuggestion } from "./ProductSuggestion"
import { ContactSection } from "../ContactSection"
import { authService } from "../../services/auth.service"
import { useNavigate } from "react-router-dom"

export const ProductDetails = () => {
    const { productId } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState<FullProduct | null>(null)
    const [selectedWoodEn, setSelectedWoodEn] = useState<string>('')
    const [selectedPriceIdx, setSelectedPriceIdx] = useState<number>(0)
    const [gallery, setGallery] = useState<string[]>([])
    const [mainImage, setMainImage] = useState<string>('')
    const { language } = useLanguage()
    const user = authService.getLoggedinUser()
    const isAdmin = user?.role?.trim().toLowerCase() === 'admin'
    const isSupplier = user?.role?.trim().toLowerCase() === 'supplier'

    useEffect(() => {
        window.scrollTo(0, 0)
        
        const loadProduct = async (): Promise<void> => {
            if (!productId) return
            try {
                const productFromDb = await productService.getById(productId)
                setProduct(productFromDb);

                if (productFromDb && productFromDb.price && productFromDb.price.length > 0) {
                    setSelectedWoodEn(productFromDb.price[0].wood.en)
                }

                if (productFromDb && productFromDb.imgsUrl) {
                    const cleanUrls = productFromDb.imgsUrl.map((url: string) => url.replace(/[\r\n\s]+/g, "").replace(/\.[^/.]+$/, ""));
                    const filteredUrls = cleanUrls.filter((url: string) => url !== 'coming-soon');
                    
                    const hPhotos = filteredUrls.filter((url: string) => url.startsWith('H_'));
                    const otherPhotos = filteredUrls.filter((url: string) => !url.startsWith('C_') && !url.startsWith('H_'));

                    const getImageUrl = (cleanName: string) => {
                        // const cloudId = import.meta.env.VITE_CLOUDINARY_ID
                        const cloudId = 'dhixlriwm'
                        if (cleanName.startsWith('H_')) return `https://res.cloudinary.com/${cloudId}/image/upload/${cleanName}.webp`
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
    const hasMetal = product.material.some(m => m.en.toLowerCase() === 'metal')
    const woodStr = product.woodType.map(w => isEnglish ? w.en : w.he).join(', ')
    const hasWood = woodStr && !product.woodType.some(w => w.en.toLowerCase() === 'no wood')
    const bulbStr = product.socketType?.screwType || ''
    const voltStr = product.socketType?.lightType || ''

    const skuStr = product.price
        ? product.price
            .filter(p => p.sku)
            .map(p => {
                const woodLabel = isEnglish ? p.wood.en : p.wood.he
                const sizeLabel = p.size ? ` - ${p.size}` : ''
                return `${p.sku}(${woodLabel}${sizeLabel})`
            })
            .join(', ')
        : ''

    const uniqueWoodTypes = product.price ? Array.from(new Set(product.price.map(p => p.wood.en))).map(en => {
        return product.price!.find(p => p.wood.en === en)!.wood
    }) : []

    const availablePricesForWood = product.price ? product.price.filter(p => p.wood.en === selectedWoodEn) : []
    const activePrice = availablePricesForWood[selectedPriceIdx] || availablePricesForWood[0]

    const onBack = () => {
        if (window.history.length > 1) {
            navigate(-1)
        } else {
            const cat = product?.category[0]?.en?.toLowerCase() || 'pendant'
            const routeCat = cat === 'hanging' ? 'pendant' : cat
            navigate(`/product/category/${routeCat}`)
        }
    }

    return (
        <div className={`product-details-page ${isEnglish ? 'ltr' : 'rtl'}`} dir={isEnglish ? 'ltr' : 'rtl'}>
            
            <div className="product-navigation-header">
                <button 
                    className="back-to-category-btn" 
                    onClick={onBack}
                >
                    <Icons iconName={isEnglish ? 'back' : 'next'} />
                    <span>{isEnglish ? 'Back' : 'חזרה'}</span>
                </button>
            </div>

            <div className="product-top-section">
                
                {/* RIGHT SIDE: INFO (Flex swaps this visually on LTR/RTL) */}
                <div className="product-info-container">
                    <div className="product-info-content">
                        <div className="product-info-header">
                            <div className="product-title-wrapper">
                                <div className="title-with-admin">
                                    <h1>{nameLabel}</h1>
                                    {isAdmin && (
                                        <button 
                                            className="admin-edit-btn-details" 
                                            onClick={() => navigate(`/dashboard?edit=${product._id}`)}
                                            title={isEnglish ? 'Edit Product' : 'ערוך מוצר'}
                                        >
                                            <Icons iconName="edit" />
                                        </button>
                                    )}
                                </div>
                                {activePrice?.amount !== undefined && (
                                    <h2 className="product-price">
                                        ₪{activePrice.amount}
                                    </h2>
                                )}
                            </div>

                            {user && (
                                <div className="variant-selectors">
                                    {uniqueWoodTypes.length > 1 && (
                                        <div className="wood-selector-details">
                                            <label htmlFor="wood-select">{isEnglish ? 'Select Finish:' : 'בחר גימור:'}</label>
                                            <select 
                                                id="wood-select"
                                                value={selectedWoodEn}
                                                onChange={(e) => {
                                                    setSelectedWoodEn(e.target.value)
                                                    setSelectedPriceIdx(0)
                                                }}
                                            >
                                                {uniqueWoodTypes.map((wood, idx) => (
                                                    <option key={idx} value={wood.en}>
                                                        {isEnglish ? wood.en : wood.he}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {availablePricesForWood.length > 1 ? (
                                        <div className="wood-selector-details">
                                            <label htmlFor="size-select">{isEnglish ? 'Select Size:' : 'בחר מידה:'}</label>
                                            <select 
                                                id="size-select"
                                                value={selectedPriceIdx}
                                                onChange={(e) => setSelectedPriceIdx(+e.target.value)}
                                            >
                                                {availablePricesForWood.map((p, idx) => (
                                                    <option key={idx} value={idx}>
                                                        {p.size || (isEnglish ? `Default` : `רגיל`)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        activePrice?.size && (
                                            <div className="wood-selector-details">
                                                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                                    <strong>{isEnglish ? 'Size:' : 'מידה:'}</strong> {activePrice.size}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
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
                                    {skuStr && <li>{isEnglish ? 'SKU:' : 'מקט:'} {skuStr}</li>}
                                    {hasWood && <li>{isEnglish ? 'Wood Type:' : 'סוג עץ:'} {woodStr}</li>}
                                    {materialsStr && <li>{isEnglish ? 'Materials:' : 'חומרים:'} {materialsStr}</li>}
                                    {voltStr && <li>{isEnglish ? 'Wattage:' : 'הספק:'} {voltStr}</li>}
                                    {bulbStr && <li>{isEnglish ? 'Bulb Type:' : 'סוג נורה:'} {bulbStr}</li>}
                                </ul>
                                {hasWood && (
                                    <p className="natural-material-note">
                                        {isEnglish 
                                            ? '* Slight variations in wood tone may occur due to the natural character of the material' 
                                            : '* ייתכנו שינויים קלים בגוון העץ בשל אופיו הטבעי של החומר'}
                                    </p>
                                )}
                                {hasMetal && (
                                    <p className="natural-material-note">
                                        {isEnglish 
                                            ? '* Metal color is customizable' 
                                            : '* צבע המתכת ניתן לבחירה'}
                                    </p>
                                )}
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
                                            if (s.depth) parts.push(`Depth ${s.depth} cm`)
                                            if (s.height) parts.push(`Height ${s.height} cm`)
                                        } else {
                                            if (s.upTo) parts.push(`עד ל- ${s.upTo} ס"מ`)
                                            if (s.diameter) parts.push(`קוטר ${s.diameter} ס"מ`)
                                            if (s.length) parts.push(`אורך ${s.length} ס"מ`)
                                            if (s.width) parts.push(`רוחב ${s.width} ס"מ`)
                                            if (s.depth) parts.push(`עומק ${s.depth} ס"מ`)
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

                            {isSupplier && (
                                <p className="supplier-vat-disclaimer">
                                    * {isEnglish ? 'Prices do not include VAT' : 'המחירים אינם כוללים מע"מ'}
                                </p>
                            )}

                            <div className="product-sec4">
                                <div className="term-box">
                                    <h4>{isEnglish ? 'Customization' : 'התאמה אישית'}</h4>
                                    <p>{isEnglish ? 'Dimensions and finishes can be customized.' : 'ניתן לשנות מידות וגימורים או לפתח דגם ייעודי לפרויקט.'}</p>
                                </div>
                                <div className="term-box">
                                    <h4>{isEnglish ? 'Production Time' : 'זמן ייצור'}</h4>
                                    <p>{isEnglish ? 'Made to order: up to 30 business days.' : 'בהזמנה: עד 30 ימי עסקים.'}</p>
                                </div>
                                <div className="term-box">
                                    <h4>{isEnglish ? 'Warranty' : 'אחריות'}</h4>
                                    <p>{isEnglish ? '1 year warranty subject to terms and conditions.' : 'שנה אחריות בהתאם לתקנון.'}</p>
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
                            <ImageWithSkeleton src={mainImage} alt={nameLabel} className="main-image" />
                        ) : (
                            <div className="no-image-placeholder" style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100%', 
                                width: '100%', 
                                backgroundColor: '#f4f4f4',
                                color: '#666',
                                fontSize: '18px'
                            }}>
                                {isEnglish ? 'No photo available' : 'אין תמונה זמינה'}
                            </div>
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
                                <ImageWithSkeleton src={imgUrl} alt={`${nameLabel} thumb ${idx}`} />
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
