import { Skeleton } from "@mui/material"

export const SkeletonProductPreview = () => {
    return (
        <div className="product-preview">
            <div className="product-preview-image-container">
                <div className="product-preview-images">
                    <div className="img-wrapper">
                        <Skeleton 
                            variant="rectangular" 
                            animation="wave" 
                            sx={{ width: '100%', height: '100%', aspectRatio: '1/1' }} 
                        />
                    </div>
                </div>
            </div>
            <span className="product-name">
                <Skeleton animation="wave" width="60%" height={24} />
            </span>
            <span className="product-price-preview">
                <Skeleton animation="wave" width="30%" height={16} />
            </span>
        </div>
    )
}
