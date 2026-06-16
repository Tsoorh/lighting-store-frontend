import { Skeleton } from "@mui/material"
import { useLanguage } from "../../hooks/useLanguage"
import '../../assets/styles/cmps/ProductDetails.css'

export const SkeletonProductDetails = () => {
    const { language } = useLanguage()
    const isEnglish = language === 'en'

    return (
        <div className={`product-details-page skeleton ${isEnglish ? 'ltr' : 'rtl'}`} dir={isEnglish ? 'ltr' : 'rtl'}>

            <div className="product-navigation-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton variant="text" width={60} height={24} />
                </div>
            </div>

            <div className="product-top-section">

                {/* INFO SIDE */}
                <div className="product-info-container">
                    <div className="product-info-content">
                        <div className="product-info-header">
                            <div className="product-title-wrapper">
                                <Skeleton variant="text" width="70%" height={50} />
                                <Skeleton variant="text" width="30%" height={36} />
                            </div>

                            <div className="variant-selectors" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className="wood-selector-details">
                                    <Skeleton variant="text" width="40%" height={20} />
                                    <Skeleton variant="rectangular" width={200} height={40} />
                                </div>
                            </div>
                        </div>

                        <div className="product-sections" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div className="product-sec1">
                                <Skeleton variant="text" width="20%" height={24} />
                                <Skeleton variant="rectangular" width="100%" height={80} />
                            </div>

                            <div className="product-sec2">
                                <Skeleton variant="text" width="30%" height={24} />
                                <Skeleton variant="rectangular" width="100%" height={60} />
                            </div>

                            <div className="product-sec3">
                                <Skeleton variant="text" width="20%" height={24} />
                                <Skeleton variant="rectangular" width="100%" height={40} />
                            </div>

                            <div className="product-sec4">
                                <Skeleton variant="rectangular" width="30%" height={60} />
                                <Skeleton variant="rectangular" width="30%" height={60} />
                                <Skeleton variant="rectangular" width="30%" height={60} />
                            </div>
                        </div>

                        <Skeleton variant="rectangular" width="100%" height={53} />
                    </div>
                </div>

                {/* GALLERY SIDE */}
                <div className="product-gallery-container">
                    <div className="gallery-top">
                        <Skeleton variant="rectangular" width="100%" height="100%" />
                    </div>
                    <div className="gallery-bottom">
                        <div className="thumbnail-wrapper">
                            <Skeleton variant="rectangular" width="100%" height="100%" />
                        </div>
                        <div className="thumbnail-wrapper">
                            <Skeleton variant="rectangular" width="100%" height="100%" />
                        </div>
                        <div className="thumbnail-wrapper">
                            <Skeleton variant="rectangular" width="100%" height="100%" />
                        </div>
                        <div className="thumbnail-wrapper">
                            <Skeleton variant="rectangular" width="100%" height="100%" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}