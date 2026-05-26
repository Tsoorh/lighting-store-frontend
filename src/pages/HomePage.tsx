import './HomePage.css'
import { Icons } from '../cmps/Icons';

export const HomePage = () => {
    return (
        <div className="main-layout">
            <div className="entry-vid">
                <video 
                    src="/images/Figma/Main_video.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="entry-video"
                />
                <img src="/images/Figma/bright_logo_horizontal.png" alt="Bright Logo" className="entry-logo" />
                <div className="entry-line"></div>
                <a href="/product/category/all" className="entry-cta">
                    <span className="entry-cta-text">צפיה בעבודות</span>
                    <Icons iconName='back' />
                </a>
                <div className="entry-vid-text">
                    גופי תאורה בעבודת יד, המשלבים 45 שנות ניסיון בעולם התאורה עם מלאכה מדויקת ורגישות חומרית. מיועד לאדריכלים, מעצבי פנים ולחללים המחפשים נוכחות על זמנית.
                </div>
            </div>
            <div className="works-sec">
                <h2 className="section-title">העבודות</h2>
                <div className="works-grid">
                    <div className="work-item">
                        <img src="/images/Figma/CAT_CEILING.jpg" alt="ceiling" />
                        <span className="work-item-title white-text">גופי תאורה צמודי תקרה</span>
                        <p className="work-item-desc">גופי תאורה צמודי תקרה המשלבים הבנה טכנית עמוקה עם אסתטיקה מוקפדת.</p>
                    </div>
                    <div className="work-item">
                        <img src="/images/Figma/CAT_WALL.jpg" alt="wall" />
                        <span className="work-item-title white-text">גופי תאורה לקיר</span>
                        <p className="work-item-desc">פתרונות תאורה פונקציונליים עם שפה עיצובית נקייה ושילוב חומרי מדויק.</p>
                    </div>
                    <div className="work-item">
                        <img src="/images/Figma/CAT_PENDANT.jpg" alt="pendant" />
                        <span className="work-item-title">גופי תאורה תלויים</span>
                        <p className="work-item-desc">גופי תאורה תלויים בעלי נוכחות פיסולית, המשלבים עץ מלא ומתכת ומתאימים לחללים פרטיים ומסחריים.</p>
                    </div>
                </div>
            </div>
            <div className="hanging-sec"></div>
            <div className="ceiling-sec"></div>
            <div className="accessories-sec"></div>
            <div className="products-sec"></div>
        </div>
    )
}