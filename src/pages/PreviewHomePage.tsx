import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { type SiteMediaConfig, DEFAULT_SITE_MEDIA } from '../model/site-media.model'
import { useLanguage } from '../hooks/useLanguage'
import { Icons } from '../cmps/Icons'
import { FullWidthBanner } from '../cmps/FullWidthBanner'
import { ContactSection } from '../cmps/ContactSection'
import '../assets/styles/pages/HomePage.css'

export const PreviewHomePage: React.FC = () => {
    const [media, setMedia] = useState<SiteMediaConfig>(DEFAULT_SITE_MEDIA)
    const { language } = useLanguage()
    const navigate = useNavigate()
    const isEn = language === 'en'

    useEffect(() => {
        const user = authService.getLoggedinUser()
        const isAdmin = user?.role?.trim().toLowerCase() === 'admin'
        if (!isAdmin) {
            navigate('/')
            return
        }

        const handleMessage = (event: MessageEvent) => {
            // Strict origin and source validation
            if (event.origin !== window.location.origin) return
            if (event.source !== window.parent) return

            if (event.data?.type === 'TL_PREVIEW_DRAFT_UPDATE' && event.data?.payload) {
                const draft = event.data.payload as SiteMediaConfig
                if (draft.heroVideo && draft.gallery && draft.gallery.slot_1) {
                    setMedia(draft)
                }
            }
        }

        window.addEventListener('message', handleMessage)

        // Inform parent iframe container that preview is ready
        window.parent.postMessage({ type: 'TL_PREVIEW_FRAME_READY' }, window.location.origin)

        return () => window.removeEventListener('message', handleMessage)
    }, [navigate])

    const heroVid = media.heroVideo
    const g = media.gallery
    const banner = media.fullWidthBanner
    const bannerPos = banner?.position ?? 2
    const isBannerVisible = !!(banner?.enabled && banner?.url)

    return (
        <div className="main-layout preview-mode-container" dir={isEn ? 'ltr' : 'rtl'}>
            {/* Section 1: Hero */}
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
                    <div className="entry-cta animated-link" style={{ pointerEvents: 'none' }}>
                        <span className="entry-cta-text">{isEn ? 'View Collection' : 'צפיה בגופי התאורה'}</span>
                        <Icons iconName={isEn ? 'next' : 'back'} />
                    </div>
                </div>
                <div className="entry-vid-text">
                    {isEn 
                        ? 'Handcrafted lighting fixtures, combining 40 years of experience in the lighting world with precise craftsmanship and material sensitivity.'
                        : 'גופי תאורה בעבודת יד, המשלבים 40 שנות ניסיון בעולם התאורה עם מלאכה מדויקת ורגישות חומרית.'}
                </div>
            </section>

            {/* Position 1 Banner */}
            {isBannerVisible && bannerPos === 1 && (
                <FullWidthBanner bannerConfig={banner} interactive={false} />
            )}

            {/* Section 2: Works / Collection */}
            <div className="works-sec page-section" id="works-section">
                <div className="section-title-container" style={{ width: '100%', maxWidth: '1280px', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <h2 className="section-title" style={{ width: 'auto', margin: 0 }}>{isEn ? 'Collection' : 'גופי התאורה'}</h2>
                    </div>
                </div>
                <div className="works-grid">
                    <div className="work-item" style={{ pointerEvents: 'none' }}>
                        <img src="/images/Figma/CAT_CEILING.jpg" alt="ceiling" />
                        <span className="work-item-title white-text">{isEn ? 'Ceiling Lighting' : 'גופי תאורה צמודי תקרה'}</span>
                        <p className="work-item-desc">{isEn ? 'Ceiling mounted fixtures combining deep technical understanding with meticulous aesthetics.' : 'גופי תאורה צמודי תקרה המשלבים הבנה טכנית עמוקה עם אסתטיקה מוקפדת.'}</p>
                    </div>
                    <div className="work-item" style={{ pointerEvents: 'none' }}>
                        <img src="/images/Figma/CAT_WALL.jpg" alt="wall" />
                        <span className="work-item-title white-text">{isEn ? 'Wall Lighting' : 'גופי תאורה לקיר'}</span>
                        <p className="work-item-desc">{isEn ? 'Functional lighting solutions with a clean design language and precise material integration.' : 'פתרונות תאורה פונקציונליים עם שפה עיצובית נקייה ושילוב חומרי מדויק.'}</p>
                    </div>
                    <div className="work-item" style={{ pointerEvents: 'none' }}>
                        <img src="/images/Figma/CAT_PENDANT.jpg" alt="pendant" />
                        <span className="work-item-title">{isEn ? 'Pendant Lighting' : 'גופי תאורה תלויים'}</span>
                        <p className="work-item-desc">{isEn ? 'Pendant lighting fixtures with a pleasant presence, combining wood and metal, suitable for private and commercial spaces.' : 'גופי תאורה תלויים בעלי נוכחות נעימה, המשלבים עץ ומתכת ומתאימים לחללים פרטיים ומסחריים.'}</p>
                    </div>
                </div>
            </div>

            {/* Position 2 Banner */}
            {isBannerVisible && bannerPos === 2 && (
                <FullWidthBanner bannerConfig={banner} interactive={false} />
            )}

            {/* Section 3: Gradient / Quote */}
            <section className="gradient-sec">
                <div className="gradient-text-wrapper">
                    <span className="gradient-text-light">{isEn ? 'Small details. ' : 'פרטים קטנים. '}</span>
                    <span className="gradient-text-medium">{isEn ? 'Big presence.' : 'נוכחות גדולה.'}</span>
                </div>
                <div className="gradient-divider"></div>
                <div className="gradient-cta animated-link" style={{ pointerEvents: 'none' }}>
                    <span>{isEn ? 'Contact us about a project' : 'צור קשר לגבי פרויקט'}</span>
                    <Icons iconName={isEn ? 'next' : 'back'} />
                </div>
            </section>

            {/* Position 3 Banner */}
            {isBannerVisible && bannerPos === 3 && (
                <FullWidthBanner bannerConfig={banner} interactive={false} />
            )}

            {/* Section 4: Gallery */}
            <section className="gallery-sec page-section">
                <div className="gallery-grid">
                    {/* Item 1: slot_1 */}
                    <div className="gallery-item">
                        <img 
                            src={g.slot_1.url} 
                            alt={isEn ? g.slot_1.alt.en : g.slot_1.alt.he} 
                            className="cover-img" 
                            style={{
                                objectPosition: `${g.slot_1.objectPosition?.x ?? 50}% ${g.slot_1.objectPosition?.y ?? 50}%`
                            }}
                        />
                    </div>

                    {/* Item 2: Fixed About Card */}
                    <div className="gallery-item gallery-about-card" dir={isEn ? 'ltr' : 'rtl'}>
                        <h3 className="gallery-about-title">
                            {isEn ? <>Second generation in lighting.<br />Choosing art.</> : <>דור שני לתאורה.<br />בחירה באמנות.</>}
                        </h3>
                        <div className="gallery-about-link animated-link" style={{ pointerEvents: 'none' }}>
                            <span>{isEn ? 'About Me' : 'אודותיי'}</span>
                            <Icons iconName={isEn ? 'next' : 'back'} />
                        </div>
                    </div>

                    {/* Item 3: slot_3 */}
                    <div className="gallery-item">
                        <img 
                            src={g.slot_3.url} 
                            alt={isEn ? g.slot_3.alt.en : g.slot_3.alt.he} 
                            className="cover-img" 
                            style={{
                                objectPosition: `${g.slot_3.objectPosition?.x ?? 50}% ${g.slot_3.objectPosition?.y ?? 50}%`
                            }}
                        />
                    </div>

                    {/* Item 4: slot_4 */}
                    <div className="gallery-item">
                        <img 
                            src={g.slot_4.url} 
                            alt={isEn ? g.slot_4.alt.en : g.slot_4.alt.he} 
                            className="cover-img" 
                            style={{
                                objectPosition: `${g.slot_4.objectPosition?.x ?? 50}% ${g.slot_4.objectPosition?.y ?? 50}%`
                            }}
                        />
                    </div>

                    {/* Item 5: slot_5 */}
                    <div className="gallery-item">
                        <img 
                            src={g.slot_5.url} 
                            alt={isEn ? g.slot_5.alt.en : g.slot_5.alt.he} 
                            className="cover-img" 
                            style={{
                                objectPosition: `${g.slot_5.objectPosition?.x ?? 50}% ${g.slot_5.objectPosition?.y ?? 50}%`
                            }}
                        />
                    </div>

                    {/* Item 6: slot_6 */}
                    <div className="gallery-item">
                        <img 
                            src={g.slot_6.url} 
                            alt={isEn ? g.slot_6.alt.en : g.slot_6.alt.he} 
                            className="cover-img" 
                            style={{
                                objectPosition: `${g.slot_6.objectPosition?.x ?? 50}% ${g.slot_6.objectPosition?.y ?? 50}%`
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Position 4 Banner */}
            {isBannerVisible && bannerPos === 4 && (
                <FullWidthBanner bannerConfig={banner} interactive={false} />
            )}

            {/* Section 5: Experience */}
            <section className="experience-sec">
                <div className="experience-top">
                    <h2 className="experience-title">
                        <span className="experience-title-medium">{isEn ? 'A lifetime of experience. ' : 'ניסיון של חיים. '}</span>
                        <span className="experience-title-light">{isEn ? 'Creation of a moment.' : 'יצירה של רגע.'}</span>
                    </h2>
                </div>
                <div className="experience-bottom animated-link" style={{ pointerEvents: 'none' }}>
                    <span className="experience-bottom-text">{isEn ? 'Request a Quote' : 'בקשה להצעת מחיר'}</span>
                    <Icons iconName={isEn ? 'next' : 'back'} />
                </div>
            </section>

            {/* Position 5 Banner */}
            {isBannerVisible && bannerPos === 5 && (
                <FullWidthBanner bannerConfig={banner} interactive={false} />
            )}

            <ContactSection />
        </div>
    )
}
