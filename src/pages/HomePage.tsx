import './HomePage.css'
import { Icons } from '../cmps/Icons';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
    const navigate = useNavigate()

    return (
        <div className="main-layout">
            <div className="entry-vid">
                <video 
                    src="/images/Figma/Main_video.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="cover-img"
                />
                <img src="/images/Figma/bright_logo_horizontal.png" alt="Bright Logo" className="entry-logo" />
                <div className="entry-line"></div>
                <a href="#works-section" className="entry-cta animated-link">
                    <span className="entry-cta-text">צפיה בעבודות</span>
                    <Icons iconName='back' />
                </a>
                <div className="entry-vid-text">
                    גופי תאורה בעבודת יד, המשלבים 45 שנות ניסיון בעולם התאורה עם מלאכה מדויקת ורגישות חומרית. מיועד לאדריכלים, מעצבי פנים ולחללים המחפשים נוכחות על זמנית.
                </div>
            </div>
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
                    </div>
                </div>
                <div className="experience-bottom"></div>
            </section>

            <div className="pendant-sec"></div>
            <div className="ceiling-sec"></div>
            <div className="accessories-sec"></div>
            <div className="products-sec"></div>
        </div>
    )
}