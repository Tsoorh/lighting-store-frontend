import '../assets/styles/pages/HomePage.css'
import { Icons } from '../cmps/Icons';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
    const navigate = useNavigate()

    return (
        <div className="main-layout">
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
                        <span className="entry-cta-text">צפיה בעבודות</span>
                        <Icons iconName='back' />
                    </a>
                </div>
                <div className="entry-vid-text">
                    גופי תאורה בעבודת יד, המשלבים 45 שנות ניסיון בעולם התאורה עם מלאכה מדויקת ורגישות חומרית. מיועד לאדריכלים, מעצבי פנים ולחללים המחפשים נוכחות על זמנית.
                </div>
            </section>
            <div className="works-sec page-section" id="works-section">
                <h2 className="section-title">העבודות</h2>
                <div className="works-grid">
                    <div className="work-item" onClick={() => navigate('/product/category/ceiling')}>
                        <img src="/images/Figma/CAT_CEILING.jpg" alt="ceiling" />
                        <span className="work-item-title white-text">גופי תאורה צמודי תקרה</span>
                        <p className="work-item-desc">גופי תאורה צמודי תקרה המשלבים הבנה טכנית עמוקה עם אסתטיקה מוקפדת.</p>
                    </div>
                    <div className="work-item" onClick={() => navigate('/product/category/wall')}>
                        <img src="/images/Figma/CAT_WALL.jpg" alt="wall" />
                        <span className="work-item-title white-text">גופי תאורה לקיר</span>
                        <p className="work-item-desc">פתרונות תאורה פונקציונליים עם שפה עיצובית נקייה ושילוב חומרי מדויק.</p>
                    </div>
                    <div className="work-item" onClick={() => navigate('/product/category/pendant')}>
                        <img src="/images/Figma/CAT_PENDANT.jpg" alt="pendant" />
                        <span className="work-item-title">גופי תאורה תלויים</span>
                        <p className="work-item-desc">גופי תאורה תלויים בעלי נוכחות פיסולית, המשלבים עץ מלא ומתכת ומתאימים לחללים פרטיים ומסחריים.</p>
                    </div>
                </div>
            </div>
            <section className="gradient-sec">
                <div className="gradient-text-wrapper">
                    <span className="gradient-text-light">פרטים קטנים. </span>
                    <span className="gradient-text-medium">נוכחות גדולה.</span>
                </div>
                
                <div className="gradient-divider"></div>
                
                <a 
                    href="https://wa.me/972524000102" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="gradient-cta animated-link"
                >
                    <span>צור קשר לגבי פרויקט</span>
                    <Icons iconName='back' />
                </a>
            </section>
            <section className="gallery-sec page-section">
                <div className="gallery-grid">
                    <div className="gallery-item">
                        <img src="/images/Figma/Tiran_Frame.png" alt="Tiran frame" className="cover-img" />
                    </div>
                    <div className="gallery-item gallery-about-card">
                        <h3 className="gallery-about-title">
                            דור שני לתאורה.<br />בחירה באמנות.
                        </h3>
                        <div className="gallery-about-link animated-link" onClick={() => navigate('/about')}>
                            <span>אודותיי</span>
                            <Icons iconName='back' />
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
                    <Icons iconName='back' />
                    <span>שיתוף פעולה מקצועי</span>
                </div>
            </section>
            
            <section className="experience-sec">
                <div className="experience-top">
                    <h2 className="experience-title">
                        <span className="experience-title-medium">ניסיון של חיים. </span>
                        <span className="experience-title-light">יצירה של רגע.</span>
                    </h2>
                    <div className="experience-points">
                        <div className="experience-point-item">
                            <div className="experience-point-icon"><div className="experience-point-dot"></div></div>
                            <div className="experience-point-text">דור שני לאנשי תאורה</div>
                        </div>
                        <div className="experience-point-item">
                            <div className="experience-point-icon"><div className="experience-point-dot"></div></div>
                            <div className="experience-point-text">שליטה מלאה בתכנון וייצור</div>
                        </div>
                        <div className="experience-point-item">
                            <div className="experience-point-icon"><div className="experience-point-dot"></div></div>
                            <div className="experience-point-text">פיתוח דגמים ייעודיים לפרויקטים</div>
                        </div>
                        <div className="experience-point-item">
                            <div className="experience-point-icon"><div className="experience-point-dot"></div></div>
                            <div className="experience-point-text">רמת גימור גבוהה במיוחד</div>
                        </div>
                    </div>
                </div>
                <div className="experience-bottom animated-link">
                    <span className="experience-bottom-text">בקשה להצעת מחיר</span>
                    <Icons iconName='back' />
                </div>
            </section>

            <section className="contact-sec page-section">
                <div className="contact-top">
                    <div className="contact-top-right">
                        <img src="/images/Figma/T_bright_logo.png" alt="Background Logo" className="cover-img" />
                    </div>
                    <div className="contact-top-left">
                        <div className="contact-top-inner-right">
                            <div className="contact-title-group">
                                <h3 className="contact-title">יצירת קשר</h3>
                                <div className="contact-socials">
                                    <a href="https://wa.me/972524000102" target="_blank" rel="noopener noreferrer"><Icons iconName="whatsapp" /></a>
                                    <a href="#" target="_blank" rel="noopener noreferrer"><Icons iconName="facebook" /></a>
                                    <a href="#" target="_blank" rel="noopener noreferrer"><Icons iconName="instagram" /></a>
                                </div>
                            </div>
                            <div className="contact-details">
                                <span className="contact-detail-text">טירן לסרי</span>
                                <span className="contact-detail-text">המזמרה 7, נס ציונה, ישראל</span>
                                <div className="contact-contact-row">
                                    <span className="contact-detail-text" dir="ltr">052-40-00-102</span>
                                    <span className="contact-detail-text">Tiranlasry@gmail.com</span>
                                </div>
                            </div>
                        </div>
                        <div className="contact-top-inner-left">
                            <form className="contact-form">
                                <div className="contact-form-row">
                                    <div className="contact-form-col">
                                        <input type="text" placeholder="שם" className="contact-form-input" />
                                        <input type="tel" placeholder="טלפון" className="contact-form-input" />
                                    </div>
                                    <div className="contact-form-col">
                                        <input type="email" placeholder="אימייל" className="contact-form-input" />
                                        <input type="text" placeholder="פניה" className="contact-form-input" />
                                    </div>
                                </div>
                                <button className="contact-submit-btn" type="submit" onClick={(e) => e.preventDefault()}>
                                    <span>שליחה</span>
                                    <Icons iconName="back" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="contact-bottom">
                    <a href="#terms" className="contact-bottom-link terms-link">תנאי שימוש</a>
                    <a href="#privacy" className="contact-bottom-link privacy-link">מדיניות פרטיות</a>
                    <a href="#accessibility" className="contact-bottom-link accessibility-link">הצהרת נגישות</a>
                </div>
            </section>
        </div>
    )
}