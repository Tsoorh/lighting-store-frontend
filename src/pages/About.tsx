import '../assets/styles/pages/AboutPage.css';
import { Icons } from '../cmps/Icons';
import { ContactSection } from '../cmps/ContactSection';
import { useLanguage } from '../hooks/useLanguage';

export const About = () => {
    const { language } = useLanguage();
    const isEn = language === 'en';

    return (
        <div className="about-layout" dir={isEn ? 'ltr' : 'rtl'}>
            
            {/* Part A: The Main Layout */}
            <section className="about-part-a">
                
                {/* Bio Section */}
                <div className="about-bio-section">
                    <div className="about-bio-content">
                        <div className="about-bio-divider-vertical"></div>
                        <div className="about-bio-text-wrapper">
                            <span className="about-bio-title">
                                {isEn ? 'Tiran Lasry has lived lighting from a young age.' : 'טירן לסרי חי תאורה מגיל צעיר.'}
                            </span>
                            <span className="about-bio-body">
                                {isEn 
                                    ? '\n\nHe grew up alongside his father, a metal spinner by profession, and learned the fundamentals of the craft through real work: material, machine, weight, and precision. These years laid the foundation for an approach that combines deep technical knowledge with design sensitivity.\n\nTiran developed products and deepened his understanding of the entire industry: from planning and production to display and sales.\n\nAfter decades of activity in the industry, he chose to return to the studio and manual work. To the material. To proportion. To precision.'
                                    : '\n\nהוא גדל לצד אביו, איש לחצן מתכת במקצועו, ולמד את יסודות המלאכה מתוך עבודה אמיתית: חומר, מכונה, משקל ודיוק. השנים הללו הניחו את היסוד לגישה המשלבת ידע טכני עמוק עם רגישות עיצובית.\n\nטירן פיתח מוצרים והעמיק בהבנת התעשייה כולה: מתכנון וייצור ועד תצוגה ומכירה.\n\nלאחר עשרות שנות עשייה בתעשייה, בחר לחזור לסטודיו ולעבודה ידנית. לחומר. לפרופורציה. לדיוק.'}
                            </span>
                        </div>
                    </div>
                    <img src="/images/Figma/Tiran_About.png" alt="Tiran About" className="about-bio-image" />
                </div>

                {/* Studio Section */}
                <div className="about-studio-section">
                    <div className="about-studio-gallery">
                        <img src="/images/Figma/About_photo1.png" alt="About detail 1" />
                        <img src="/images/Figma/About_photo2.png" alt="About detail 2" />
                        <img src="/images/Figma/About_photo3.png" alt="About detail 3" />
                        <img src="/images/Figma/About_photo4.png" alt="About detail 4" />
                    </div>
                    <div className="about-studio-content">
                        <div className="about-studio-divider-horizontal"></div>
                        <div className="about-studio-text">
                            {isEn 
                                ? 'In his studio, handcrafted lighting fixtures are created, combining wood, metal, and glass to create functional objects with a presence.\n\nThe works are born from a dialogue with space, light, and people.\nEach lighting fixture is created to illuminate the place, but also to define the atmosphere within it.\n\nTiran works in collaboration with lighting designers, architects, interior designers, and private clients who are looking for precise, high-quality, and timeless lighting solutions.'
                                : 'בסטודיו שלו נוצרים גופי תאורה בעבודת יד המשלבים עץ, מתכת וזכוכית ליצירת אובייקטים פונקציונליים בעלי נוכחות.\n\nהעבודות נולדות מתוך דיאלוג עם החלל, האור והאדם.\nכל גוף תאורה נוצר כדי להאיר את המקום, אך גם להגדיר את האווירה שבו.\n\nטירן עובד בשיתוף פעולה עם מתכנני תאורה, אדריכלים, מעצבי פנים ולקוחות פרטיים המחפשים פתרונות תאורה מדויקים, איכותיים ועל־זמניים.'}
                        </div>
                    </div>
                </div>
                
            </section>

            {/* Part B: Gradient CTA */}
            <section className="about-gradient-sec gradient-sec">
                <div className="gradient-text-wrapper">
                    <span className="gradient-text-medium">{isEn ? 'Precision ' : 'דיוק '}</span>
                    <span className="gradient-text-light">{isEn ? 'built over a lifetime' : 'שנבנה לאורך חיים שלמים'}</span>
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

            {/* Footer Form Section */}
            <ContactSection />
        </div>
    );
}