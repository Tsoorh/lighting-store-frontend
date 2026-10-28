import React from 'react'
import type { FullWidthBannerConfig } from '../model/site-media.model'
import { useLanguage } from '../hooks/useLanguage'
import '../assets/styles/cmps/FullWidthBanner.css'

interface FullWidthBannerProps {
    bannerConfig?: FullWidthBannerConfig
    interactive?: boolean
}

export const FullWidthBanner: React.FC<FullWidthBannerProps> = ({
    bannerConfig,
    interactive = true
}) => {
    const { language } = useLanguage()
    const isEn = language === 'en'

    if (!bannerConfig || !bannerConfig.enabled || !bannerConfig.url) {
        return null
    }

    const altText = isEn 
        ? (bannerConfig.alt?.en || 'Full-width showcase banner') 
        : (bannerConfig.alt?.he || 'באנר תצוגה ברוחב מלא')

    const posX = bannerConfig.objectPosition?.x ?? 50
    const posY = bannerConfig.objectPosition?.y ?? 50

    const imgElement = (
        <img
            src={bannerConfig.url}
            alt={altText}
            className="full-width-banner-img"
            style={{
                objectPosition: `${posX}% ${posY}%`
            }}
            loading="lazy"
        />
    )

    return (
        <section className="full-width-banner-sec" aria-label={altText}>
            {bannerConfig.linkUrl && interactive ? (
                <a 
                    href={bannerConfig.linkUrl} 
                    className="full-width-banner-link"
                    target={bannerConfig.linkUrl.startsWith('http') ? '_blank' : undefined}
                    rel={bannerConfig.linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                    {imgElement}
                </a>
            ) : (
                <div className="full-width-banner-wrapper">
                    {imgElement}
                </div>
            )}
        </section>
    )
}

