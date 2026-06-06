import { useState } from 'react'
import { Skeleton } from '@mui/material'

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    className?: string
}

export const ImageWithSkeleton = ({ src, alt, className, ...props }: ImageWithSkeletonProps) => {
    const [isLoaded, setIsLoaded] = useState(false)

    return (
        <div className="image-with-skeleton-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
            {!isLoaded && (
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1
                    }}
                />
            )}
            <img
                src={src}
                alt={alt}
                className={className}
                onLoad={() => setIsLoaded(true)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                    display: 'block'
                }}
                {...props}
            />
        </div>
    )
}
