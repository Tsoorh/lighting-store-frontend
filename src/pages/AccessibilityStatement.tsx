import { useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import '../assets/styles/pages/LegalPage.css';

export const AccessibilityStatement = () => {
    const { language } = useLanguage();
    const isEn = language === 'en';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const currentDate = new Date();
    const formattedDateEn = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const formattedDateHe = currentDate.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });

    return (
        <div className="legal-layout" dir={isEn ? 'ltr' : 'rtl'}>
            <section className="legal-content">
                <h1>{isEn ? 'Accessibility Statement' : 'הצהרת נגישות'}</h1>
                <p>
                    {isEn
                        ? 'The management of the "Tiran Lasry" website considers it of paramount importance to provide equal service to all surfers and customers, including people with disabilities. We operate in accordance with the Equal Rights for Persons with Disabilities Law and the Service Accessibility Regulations.'
                        : 'הנהלת האתר "טירן לסרי" רואה בחשיבות עליונה את מתן השירות השוויוני לכלל הגולשים והלקוחות, לרבות אנשים עם מוגבלות. אנו פועלים בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות ותקנות נגישות השירות.'}
                </p>

                <h2>{isEn ? 'Website Accessibility' : 'נגישות האתר'}</h2>
                <p>
                    {isEn
                        ? 'This website has been made accessible in accordance with the Web Content Accessibility Guidelines at the AA level (or as determined by the Israeli standard SI 5568 based on WCAG 2.0 guidelines).'
                        : 'אתר זה הונגש בהתאם להנחיות הנגישות באינטרנט ברמת AA (או כפי שנקבע בתקן הישראלי ת"י 5568 המבוסס על הנחיות WCAG 2.0).'}
                </p>
                <p>
                    {isEn ? 'Among other things, the following accessibility adjustments were made on the website:' : 'בין היתר, בוצעו התאמות הנגישות הבאות באתר:'}
                </p>
                <ul>
                    <li>
                        <strong>{isEn ? 'Accessibility Component (Plugin): ' : 'רכיב נגישות (תוסף): '}</strong>
                        {isEn ? 'An accessibility menu is installed on the website that allows control over font size, changing color contrast, highlighting links, blocking animations and more.' : 'באתר מותקן תפריט נגישות המאפשר שליטה על גודל הגופן, שינוי ניגודיות צבעים, הדגשת קישורים, חסימת אנימציות ועוד.'}
                    </li>
                    <li>
                        <strong>{isEn ? 'Keyboard Navigation: ' : 'ניווט מקלדת: '}</strong>
                        {isEn ? 'The website supports full navigation using the keyboard (using the Tab key and arrow keys).' : 'האתר תומך בניווט מלא באמצעות המקלדת (שימוש במקש Tab ומקשי החצים).'}
                    </li>
                    <li>
                        <strong>{isEn ? 'Browser Compatibility: ' : 'תאימות לדפדפנים: '}</strong>
                        {isEn ? 'The website is adapted to leading browsers (Chrome, Edge, Firefox, Safari) and mobile operation.' : 'האתר מותאם לדפדפנים המובילים (Chrome, Edge, Firefox, Safari) ולעבודה במובייל.'}
                    </li>
                    <li>
                        <strong>{isEn ? 'Alternative Text (Alt): ' : 'טקסט אלטרנטיבי (Alt): '}</strong>
                        {isEn ? 'Adding a textual description to essential images and graphic elements (where possible).' : 'הוספת תיאור טקסטואלי לתמונות ורכיבים גרפיים מהותיים (במידת האפשר).'}
                    </li>
                </ul>

                <h2>{isEn ? 'Accessibility of the Branch / Offices' : 'נגישות הסניף / המשרדים'}</h2>
                <ul>
                    <li>{isEn ? 'The office/store is located at: HaMazmera 7, Ness Ziona, Israel.' : 'המשרד/החנות ממוקמים בכתובת: המזמרה 7, נס ציונה, ישראל.'}</li>
                    <li>{isEn ? 'Accessible parking for a disabled vehicle is available: Yes.' : 'קיימת חניה נגישה לרכב נכים: כן.'}</li>
                    <li>{isEn ? 'Access roads and entrance to the business are accessible for wheelchairs: Yes.' : 'דרכי הגישה והכניסה לעסק נגישות לכיסאות גלגלים: כן.'}</li>
                    <li>{isEn ? 'Disabled restrooms are available in the complex: Yes.' : 'קיימים שירותי נכים במתחם: כן.'}</li>
                </ul>

                <h2>{isEn ? 'Accessibility Coordinator Details and Inquiries' : 'פרטי רכז/ת הנגישות ופניות'}</h2>
                <p>
                    {isEn
                        ? 'Despite our efforts to make all website pages accessible, you may encounter parts that have not yet been fully made accessible or are not properly accessible. If you found a malfunction or have a suggestion for improvement, we will be happy to be at your service.'
                        : 'למרות מאמצינו להנגיש את כלל דפי האתר, ייתכן ותיתקל בחלקים שטרם הונגשו במלואם או שאינם מונגשים כראוי. אם מצאת תקלה או שיש לך הצעה לשיפור, נשמח לעמוד לרשותך.'}
                </p>
                <ul>
                    <li>{isEn ? 'Accessibility Coordinator Name: Tiran Lasry' : 'שם רכז/ת הנגישות: טירן לסרי'}</li>
                    <li>{isEn ? 'Phone: 052-40-00-102' : 'טלפון: 052-40-00-102'}</li>
                    <li>{isEn ? 'Email: Tiranlasry@gmail.com' : 'דואר אלקטרוני: Tiranlasry@gmail.com'}</li>
                </ul>
                <p style={{ marginTop: '24px' }}>
                    {isEn ? `The accessibility statement was last updated on: ${formattedDateEn}` : `הצהרת הנגישות עודכנה לאחרונה בתאריך: ${formattedDateHe}`}
                </p>
            </section>
        </div>
    );
};