import '../assets/styles/pages/HomePage.css'
import { Icons } from '../cmps/Icons';
import { useNavigate } from 'react-router-dom';
import { ContactSection } from '../cmps/ContactSection';
import { useLanguage } from '../hooks/useLanguage';

export const HomePage = () => {
    const navigate = useNavigate()
    const { language } = useLanguage()
    const isEn = language === 'en'

    return (
        <div className="main-layout" dir={isEn ? 'ltr' : 'rtl'}>
            <section className="hero-section">
                <div className="entry-vid">
                    <video 
                        src="/images/Figma/Main_video.mp4" 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="cover-img"
                    />
                    <img src="/images/Figma/bright_logo_horizontal.png" alt="Bright Logo" className="entry-logo entry-logo-desktop" />
                    <div className="entry-logo entry-logo-mobile">
                        <img src="/images/Figma/T_tiran_slogen_logo.png" alt="Tiran Logo" />
                        <img src="/images/Figma/Tiran_lasry_slogen.png" alt="Tiran Lasry Slogan" />
                    </div>
                    <div className="entry-line"></div>
                    <a href="#works-section" className="entry-cta animated-link">
                        <span className="entry-cta-text">{isEn ? 'View Collection' : 'צפיה בגופי התאורה'}</span>
                        <Icons iconName={isEn ? 'next' : 'back'} />
                    </a>
                </div>
                <div className="entry-vid-text">
                    {isEn 
                        ? 'Handcrafted lighting fixtures, combining 45 years of experience in the lighting world with precise craftsmanship and material sensitivity. Designed for architects, interior designers, and spaces seeking a timeless presence.'
                        : 'גופי תאורה בעבודת יד, המשלבים 45 שנות ניסיון בעולם התאורה עם מלאכה מדויקת ורגישות חומרית. מיועד לאדריכלים, מעצבי פנים ולחללים המחפשים נוכחות על זמנית.'}
                </div>
            </section>
            <div className="works-sec page-section" id="works-section">
                <h2 className="section-title">{isEn ? 'Collection' : 'גופי התאורה'}</h2>
                <div className="works-grid">
                    <div className="work-item" onClick={() => navigate('/product/category/ceiling')}>
                        <img src="/images/Figma/CAT_CEILING.jpg" alt="ceiling" />
                        <span className="work-item-title white-text">{isEn ? 'Ceiling Lighting' : 'גופי תאורה צמודי תקרה'}</span>
                        <p className="work-item-desc">{isEn ? 'Ceiling mounted fixtures combining deep technical understanding with meticulous aesthetics.' : 'גופי תאורה צמודי תקרה המשלבים הבנה טכנית עמוקה עם אסתטיקה מוקפדת.'}</p>
                    </div>
                    <div className="work-item" onClick={() => navigate('/product/category/wall')}>
                        <img src="/images/Figma/CAT_WALL.jpg" alt="wall" />
                        <span className="work-item-title white-text">{isEn ? 'Wall Lighting' : 'גופי תאורה לקיר'}</span>
                        <p className="work-item-desc">{isEn ? 'Functional lighting solutions with a clean design language and precise material integration.' : 'פתרונות תאורה פונקציונליים עם שפה עיצובית נקייה ושילוב חומרי מדויק.'}</p>
                    </div>
                    <div className="work-item" onClick={() => navigate('/product/category/pendant')}>
                        <img src="/images/Figma/CAT_PENDANT.jpg" alt="pendant" />
                        <span className="work-item-title">{isEn ? 'Pendant Lighting' : 'גופי תאורה תלויים'}</span>
                        <p className="work-item-desc">{isEn ? 'Pendant lighting fixtures with sculptural presence, combining solid wood and metal, suitable for private and commercial spaces.' : 'גופי תאורה תלויים בעלי נוכחות פיסולית, המשלבים עץ מלא ומתכת ומתאימים לחללים פרטיים ומסחריים.'}</p>
                    </div>
                </div>
            </div>

            <section className="gradient-sec">
                <div className="gradient-text-wrapper">
                    <span className="gradient-text-light">{isEn ? 'Small details. ' : 'פרטים קטנים. '}</span>
                    <span className="gradient-text-medium">{isEn ? 'Big presence.' : 'נוכחות גדולה.'}</span>
                </div>
                
                <div className="gradient-divider"></div>
                
                <a 
                    href="https://wa.me/972524000102" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="gradient-cta animated-link"
                >
                    <span>{isEn ? 'Contact us about a project' : 'צור קשר לגבי פרויקט'}</span>
                    <Icons iconName={isEn ? 'next' : 'back'} />
                </a>
            </section>

            <section className="gallery-sec page-section">
                <div className="gallery-grid">
                    <div className="gallery-item">
                        <img src="/images/Figma/Tiran_Frame.png" alt="Tiran frame" className="cover-img" />
                    </div>
                    <div className="gallery-item gallery-about-card" dir={isEn ? 'ltr' : 'rtl'}>
                        <h3 className="gallery-about-title">
                            {isEn ? <>Second generation in lighting.<br />Choosing art.</> : <>דור שני לתאורה.<br />בחירה באמנות.</>}
                        </h3>
                        <div className="gallery-about-link animated-link" onClick={() => navigate('/about')}>
                            <span>{isEn ? 'About Me' : 'אודותיי'}</span>
                            <Icons iconName={isEn ? 'next' : 'back'} />
                        </div>
                    </div>
                    <div className="gallery-item">
                        <img src="/images/Figma/Green_light.png" alt="Green light" className="cover-img" />
                    </div>
                    <div className="gallery-item">
                        <img src="/images/Figma/Living_room.png" alt="Living room" className="cover-img" />
                    </div>
                    <div className="gallery-item">
                        <img src="/images/Figma/Table_light.png" alt="Table light" className="cover-img" />
                    </div>
                    <div className="gallery-item">
                        <img src="/images/Figma/Wall_light.png" alt="Wall light" className="cover-img" />
                    </div>
                </div>
                <div className="gallery-collab-link animated-link" onClick={() => navigate('/contact')}>
                    <span>{isEn ? 'Professional Collaboration' : 'שיתוף פעולה מקצועי'}</span>
                    <Icons iconName={isEn ? 'next' : 'back'} />
                </div>
            </section>
            
            <section className="experience-sec">
                <div className="experience-top">
                    <h2 className="experience-title">
                        <span className="experience-title-medium">{isEn ? 'A lifetime of experience. ' : 'ניסיון של חיים. '}</span>
                        <span className="experience-title-light">{isEn ? 'Creation of a moment.' : 'יצירה של רגע.'}</span>
                    </h2>
                    <div className="experience-points">
                        <div className="experience-point-item">
                            <div className="experience-point-icon"><div className="experience-point-dot"></div></div>
                            <div className="experience-point-text">{isEn ? 'Second generation lighting professionals' : 'דור שני לאנשי תאורה'}</div>
                        </div>
                        <div className="experience-point-item">
                            <div className="experience-point-icon"><div className="experience-point-dot"></div></div>
                            <div className="experience-point-text">{isEn ? 'Full control over design and production' : 'שליטה מלאה בתכנון וייצור'}</div>
                        </div>
                        <div className="experience-point-item">
                            <div className="experience-point-icon"><div className="experience-point-dot"></div></div>
                            <div className="experience-point-text">{isEn ? 'Development of custom models for projects' : 'פיתוח דגמים ייעודיים לפרויקטים'}</div>
                        </div>
                        <div className="experience-point-item">
                            <div className="experience-point-icon"><div className="experience-point-dot"></div></div>
                            <div className="experience-point-text">{isEn ? 'Exceptionally high finish level' : 'רמת גימור גבוהה במיוחד'}</div>
                        </div>
                    </div>
                </div>
                <a href="mailto:tiranlasry@gmail.com" className="experience-bottom animated-link">
                    <span className="experience-bottom-text">{isEn ? 'Request a Quote' : 'בקשה להצעת מחיר'}</span>
                    <Icons iconName={isEn ? 'next' : 'back'} />
                </a>
            </section>

            <ContactSection />
        </div>
    )
}