import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { SiteMediaConfig } from '../model/site-media.model'
import { Icons } from './Icons'
import { FullWidthBanner } from './FullWidthBanner'
import { ContactSection } from './ContactSection'

interface HomeContentProps {
    media: SiteMediaConfig
    isEn: boolean
    isPreview?: boolean
    canDownloadPriceList?: boolean
    onDownloadPriceList?: (type: 'pdf' | 'excel') => void
}

const COLLECTION_CATEGORIES = [
    {
        route: '/product/category/ceiling',
        img: '/images/Figma/CAT_CEILING.jpg',
        alt: 'ceiling',
        titleClass: 'work-item-title white-text',
        ariaEn: 'View Ceiling Lighting',
        ariaHe: 'צפה בגופי תאורה צמודי תקרה',
        titleEn: 'Ceiling Lighting',
        titleHe: 'גופי תאורה צמודי תקרה',
        descEn: 'Ceiling mounted fixtures combining deep technical understanding with meticulous aesthetics.',
        descHe: 'גופי תאורה צמודי תקרה המשלבים הבנה טכנית עמוקה עם אסתטיקה מוקפדת.'
    },
    {
        route: '/product/category/wall',
        img: '/images/Figma/CAT_WALL.jpg',
        alt: 'wall',
        titleClass: 'work-item-title white-text',
        ariaEn: 'View Wall Lighting',
        ariaHe: 'צפה בגופי תאורה לקיר',
        titleEn: 'Wall Lighting',
        titleHe: 'גופי תאורה לקיר',
        descEn: 'Functional lighting solutions with a clean design language and precise material integration.',
        descHe: 'פתרונות תאורה פונקציונליים עם שפה עיצובית נקייה ושילוב חומרי מדויק.'
    },
    {
        route: '/product/category/pendant',
        img: '/images/Figma/CAT_PENDANT.jpg',
        alt: 'pendant',
        titleClass: 'work-item-title',
        ariaEn: 'View Pendant Lighting',
        ariaHe: 'צפה בגופי תאורה תלויים',
        titleEn: 'Pendant Lighting',
        titleHe: 'גופי תאורה תלויים',
        descEn: 'Pendant lighting fixtures with a pleasant presence, combining wood and metal, suitable for private and commercial spaces.',
        descHe: 'גופי תאורה תלויים בעלי נוכחות נעימה, המשלבים עץ ומתכת ומתאימים לחללים פרטיים ומסחריים.'
    }
] as const

const EXPERIENCE_POINTS = [
    { en: 'Second generation lighting professionals', he: 'דור שני לאנשי תאורה' },
    { en: 'Full control over design and production', he: 'שליטה מלאה בתכנון וייצור' },
    { en: 'Development of custom models for projects', he: 'פיתוח דגמים ייעודיים לפרויקטים' },
    { en: 'Exceptionally high finish level', he: 'רמת גימור גבוהה במיוחד' }
] as const

const GALLERY_SLOT_ORDER = ['slot_1', 'about', 'slot_3', 'slot_4', 'slot_5', 'slot_6'] as const

export const HomeContent: React.FC<HomeContentProps> = ({
    media,
    isEn,
    isPreview = false,
    canDownloadPriceList = false,
    onDownloadPriceList
}) => {
    const navigate = useNavigate()
    const heroVid = media.heroVideo
    const g = media.gallery
    const banner = media.fullWidthBanner
    const bannerPos = banner?.position ?? 2
    const isBannerVisible = !!(banner?.enabled && banner?.url)

    const renderBanner = (pos: number) => {
        if (!isBannerVisible || bannerPos !== pos) return null
        return <FullWidthBanner bannerConfig={banner} interactive={!isPreview} />
    }

    return (
        <div className={`main-layout${isPreview ? ' preview-mode-container' : ''}`} dir={isEn ? 'ltr' : 'rtl'}>
            <section className="hero-section">
                <div className="entry-vid">
                    <video
                        key={heroVid.url}
                        src={heroVid.url}
                        poster={heroVid.posterUrl || undefined}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="cover-img"
                        style={{
                            objectPosition: `${heroVid.objectPosition?.x ?? 50}% ${heroVid.objectPosition?.y ?? 50}%`
                        }}
                    />
                    <img src="/images/Figma/bright_logo_horizontal.png" alt="Bright Logo" className="entry-logo entry-logo-desktop" />
                    <div className="entry-logo entry-logo-mobile">
                        <img src="/images/Figma/T_tiran_slogen_logo.png" alt="Tiran Logo" />
                        <img src="/images/Figma/Tiran_lasry_slogen.png" alt="Tiran Lasry Slogan" />
                    </div>
                    <div className="entry-line"></div>
                    {isPreview ? (
                        <div className="entry-cta animated-link" style={{ pointerEvents: 'none' }}>
                            <span className="entry-cta-text">{isEn ? 'View Collection' : 'צפיה בגופי התאורה'}</span>
                            <Icons iconName={isEn ? 'next' : 'back'} />
                        </div>
                    ) : (
                        <a href="#works-section" className="entry-cta animated-link">
                            <span className="entry-cta-text">{isEn ? 'View Collection' : 'צפיה בגופי התאורה'}</span>
                            <Icons iconName={isEn ? 'next' : 'back'} />
                        </a>
                    )}
                </div>
                <div className="entry-vid-text">
                    {isEn
                        ? 'Handcrafted lighting fixtures, combining 40 years of experience in the lighting world with precise craftsmanship and material sensitivity. Designed for architects, interior designers, and spaces seeking a timeless presence.'
                        : 'גופי תאורה בעבודת יד, המשלבים 40 שנות ניסיון בעולם התאורה עם מלאכה מדויקת ורגישות חומרית. מיועד לאדריכלים, מעצבי פנים ולחללים המחפשים נוכחות על זמנית.'}
                </div>
            </section>

            {renderBanner(1)}

            <div className="works-sec page-section" id="works-section">
                <div className="section-title-container" style={{ width: '100%', maxWidth: '1280px', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <h2 className="section-title" style={{ width: 'auto', margin: 0 }}>{isEn ? 'Collection' : 'גופי התאורה'}</h2>
                        {!isPreview && canDownloadPriceList && onDownloadPriceList && (
                            <div className="download-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span className="price-list-label" style={{ fontSize: '14px', fontWeight: 500, color: '#333', fontFamily: 'Heebo, sans-serif' }}>
                                    {isEn ? 'Price List:' : 'מחירון:'}
                                </span>
                                <button
                                    onClick={() => onDownloadPriceList('pdf')}
                                    className="btn-download-price pdf"
                                    style={{ background: 'none', cursor: 'pointer', textDecoration: 'none', color: '#d32f2f', fontWeight: 'bold', fontSize: '13px', border: '1px solid #d32f2f', padding: '3px 8px', borderRadius: '4px', transition: 'all 0.2s ease' }}
                                    title={isEn ? 'Download PDF Price List' : 'הורד מחירון PDF'}
                                >
                                    PDF
                                </button>
                                <button
                                    onClick={() => onDownloadPriceList('excel')}
                                    className="btn-download-price xlsx"
                                    style={{ background: 'none', cursor: 'pointer', textDecoration: 'none', color: '#2e7d32', fontWeight: 'bold', fontSize: '13px', border: '1px solid #2e7d32', padding: '3px 8px', borderRadius: '4px', transition: 'all 0.2s ease' }}
                                    title={isEn ? 'Download Excel Price List' : 'הורד מחירון Excel'}
                                >
                                    XLSX
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="works-grid">
                    {COLLECTION_CATEGORIES.map(cat => (
                        <div
                            key={cat.route}
                            className="work-item"
                            style={isPreview ? { pointerEvents: 'none' } : undefined}
                            role={isPreview ? undefined : 'link'}
                            tabIndex={isPreview ? undefined : 0}
                            onClick={isPreview ? undefined : () => navigate(cat.route)}
                            onKeyDown={isPreview ? undefined : (e) => (e.key === 'Enter' || e.key === ' ') && navigate(cat.route)}
                            aria-label={isPreview ? undefined : (isEn ? cat.ariaEn : cat.ariaHe)}
                        >
                            <img src={cat.img} alt={cat.alt} />
                            <span className={cat.titleClass}>{isEn ? cat.titleEn : cat.titleHe}</span>
                            <p className="work-item-desc">{isEn ? cat.descEn : cat.descHe}</p>
                        </div>
                    ))}
                </div>
            </div>

            {renderBanner(2)}

            <section className="gradient-sec">
                <div className="gradient-text-wrapper">
                    <span className="gradient-text-light">{isEn ? 'Small details. ' : 'פרטים קטנים. '}</span>
                    <span className="gradient-text-medium">{isEn ? 'Big presence.' : 'נוכחות גדולה.'}</span>
                </div>

                <div className="gradient-divider"></div>

                {isPreview ? (
                    <div className="gradient-cta animated-link" style={{ pointerEvents: 'none' }}>
                        <span>{isEn ? 'Contact us about a project' : 'צור קשר לגבי פרויקט'}</span>
                        <Icons iconName={isEn ? 'next' : 'back'} />
                    </div>
                ) : (
                    <a
                        href={`https://wa.me/972547513434?text=${encodeURIComponent(
                            isEn
                                ? 'Hi, I reached out through the website and would like to consult regarding a lighting project.'
                                : 'היי, הגעתי דרך האתר ואשמח להתייעץ לגבי פרויקט תאורה.'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gradient-cta animated-link"
                    >
                        <span>{isEn ? 'Contact us about a project' : 'צור קשר לגבי פרויקט'}</span>
                        <Icons iconName={isEn ? 'next' : 'back'} />
                    </a>
                )}
            </section>

            {renderBanner(3)}

            <section className="gallery-sec page-section">
                <div className="gallery-grid">
                    {GALLERY_SLOT_ORDER.map(slotKey => {
                        if (slotKey === 'about') {
                            return (
                                <div key="about" className="gallery-item gallery-about-card" dir={isEn ? 'ltr' : 'rtl'}>
                                    <h3 className="gallery-about-title">
                                        {isEn ? <>Second generation in lighting.<br />Choosing art.</> : <>דור שני לתאורה.<br />בחירה באמנות.</>}
                                    </h3>
                                    <div
                                        className="gallery-about-link animated-link"
                                        style={isPreview ? { pointerEvents: 'none' } : undefined}
                                        role={isPreview ? undefined : 'link'}
                                        tabIndex={isPreview ? undefined : 0}
                                        onClick={isPreview ? undefined : () => navigate('/about')}
                                        onKeyDown={isPreview ? undefined : (e) => (e.key === 'Enter' || e.key === ' ') && navigate('/about')}
                                        aria-label={isPreview ? undefined : (isEn ? 'About Me' : 'אודותיי')}
                                    >
                                        <span>{isEn ? 'About Me' : 'אודותיי'}</span>
                                        <Icons iconName={isEn ? 'next' : 'back'} />
                                    </div>
                                </div>
                            )
                        }

                        const slot = g[slotKey]
                        return (
                            <div key={slotKey} className="gallery-item">
                                <img
                                    src={slot.url}
                                    alt={isEn ? slot.alt.en : slot.alt.he}
                                    className="cover-img"
                                    style={{
                                        objectPosition: `${slot.objectPosition?.x ?? 50}% ${slot.objectPosition?.y ?? 50}%`
                                    }}
                                />
                            </div>
                        )
                    })}
                </div>
                {!isPreview && (
                    <div
                        className="gallery-collab-link animated-link"
                        role="link"
                        tabIndex={0}
                        onClick={() => navigate('/contact')}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/contact')}
                        aria-label={isEn ? 'Professional Collaboration' : 'שיתוף פעולה מקצועי'}
                    >
                        <span>{isEn ? 'Professional Collaboration' : 'שיתוף פעולה מקצועי'}</span>
                        <Icons iconName={isEn ? 'next' : 'back'} />
                    </div>
                )}
            </section>

            {renderBanner(4)}

            <section className="experience-sec">
                <div className="experience-top">
                    <h2 className="experience-title">
                        <span className="experience-title-medium">{isEn ? 'A lifetime of experience. ' : 'ניסיון של חיים. '}</span>
                        <span className="experience-title-light">{isEn ? 'Creation of a moment.' : 'יצירה של רגע.'}</span>
                    </h2>
                    <div className="experience-points">
                        {EXPERIENCE_POINTS.map(point => (
                            <div key={point.en} className="experience-point-item">
                                <div className="experience-point-icon"><div className="experience-point-dot"></div></div>
                                <div className="experience-point-text">{isEn ? point.en : point.he}</div>
                            </div>
                        ))}
                    </div>
                </div>
                {isPreview ? (
                    <div className="experience-bottom animated-link" style={{ pointerEvents: 'none' }}>
                        <span className="experience-bottom-text">{isEn ? 'Request a Quote' : 'בקשה להצעת מחיר'}</span>
                        <Icons iconName={isEn ? 'next' : 'back'} />
                    </div>
                ) : (
                    <a href="mailto:tiranlasry@gmail.com" className="experience-bottom animated-link">
                        <span className="experience-bottom-text">{isEn ? 'Request a Quote' : 'בקשה להצעת מחיר'}</span>
                        <Icons iconName={isEn ? 'next' : 'back'} />
                    </a>
                )}
            </section>

            {renderBanner(5)}

            <ContactSection />
        </div>
    )
}
