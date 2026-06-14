import { useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import '../assets/styles/pages/LegalPage.css';
import { Icons } from '../cmps/Icons';
import { useNavigate } from 'react-router-dom';

export const PrivacyPolicy = () => {
    const { language } = useLanguage();
    const isEn = language === 'en';
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="legal-layout" dir={isEn ? 'ltr' : 'rtl'}>
            <div className="product-navigation-header">
                <button 
                    className="back-to-category-btn" 
                    onClick={() => navigate(-1)}
                >
                    <Icons iconName={isEn ? 'back' : 'next'} />
                    <span>{isEn ? 'Back' : 'חזרה'}</span>
                </button>
            </div>
            <section className="legal-content">
                <h1>{isEn ? 'Privacy Policy' : 'מדיניות הפרטיות'}</h1>
                <p>
                    {isEn
                        ? 'The Website Management respects the privacy of users on the website. This document details how we collect, use and protect your information.'
                        : 'הנהלת האתר מכבדת את פרטיותם של המשתמשים באתר. מסמך זה מפרט כיצד אנו אוספים, משתמשים ומגנים על המידע שלך.'}
                </p>

                <h2>{isEn ? 'Information Collection' : 'איסוף המידע'}</h2>
                <p>
                    {isEn ? 'While using the website, two types of information may be collected:' : 'בעת השימוש באתר, ייתכן ויאספו שני סוגי מידע:'}
                </p>
                <ul>
                    <li>
                        {isEn
                            ? 'Personal information provided voluntarily: When filling out a contact form, registering for a customer club or making a purchase (such as: full name, email address, phone number, shipping address).'
                            : 'מידע אישי שנמסר מרצון: בעת מילוי טופס יצירת קשר, הרשמה למועדון לקוחות או ביצוע רכישה (כגון: שם מלא, כתובת דוא"ל, מספר טלפון, כתובת למשלוח).'}
                    </li>
                    <li>
                        {isEn
                            ? 'Technical/statistical information: Anonymous information collected automatically about your browsing habits, browser type, IP address and time spent on the website, to improve the user experience.'
                            : 'מידע טכני/סטטיסטי: מידע אנונימי הנאסף אוטומטית על הרגלי הגלישה שלך, סוג הדפדפן, כתובת IP וזמני השהות באתר, לצורך שיפור חוויית המשתמש.'}
                    </li>
                </ul>

                <h2>{isEn ? 'Use of Information' : 'השימוש במידע'}</h2>
                <p>
                    {isEn ? 'The collected information will be used solely for the following purposes:' : 'המידע שנאסף ישמש אך ורק למטרות הבאות:'}
                </p>
                <ul>
                    <li>{isEn ? 'Providing the services and products ordered from the website.' : 'אספקת השירותים והמוצרים שהוזמנו מהאתר.'}</li>
                    <li>{isEn ? 'Contacting, answering inquiries and providing customer service.' : 'יצירת קשר, מענה לפניות ומתן שירות לקוחות.'}</li>
                    <li>{isEn ? 'Sending promotional mailings, promotions and updates (only if explicit consent was given by the user. You can remove yourself from the mailing list at any time).' : 'שליחת דיוור פרסומי, מבצעים ועדכונים (רק במידה וניתנה הסכמה מפורשת לכך מצד המשתמש. ניתן להסיר את עצמך מרשימת התפוצה בכל עת).'}</li>
                    <li>{isEn ? 'Improving and streamlining the website and the shopping and browsing experience.' : 'שיפור וייעול האתר וחוויית הקנייה והגלישה.'}</li>
                </ul>

                <h2>{isEn ? 'Transfer of Information to a Third Party' : 'העברת מידע לצד שלישי'}</h2>
                <p>
                    {isEn
                        ? 'The Company will not sell, rent or provide your personal details to third parties, except in the following cases:'
                        : 'החברה לא תמכור, תשכיר או תמסור את פרטיך האישיים לצדדים שלישיים, למעט במקרים הבאים:'}
                </p>
                <ul>
                    <li>{isEn ? 'To shipping companies and suppliers to complete the order and ship the products.' : 'לחברות שילוח וספקים לצורך השלמת ההזמנה ומשלוח המוצרים.'}</li>
                    <li>{isEn ? 'In the event of a legal obligation or a court order instructing the Company to provide the information.' : 'במקרה של חובה חוקית או צו שיפוטי המורה לחברה למסור את המידע.'}</li>
                    <li>{isEn ? "To protect the Company's legal rights in the event of a dispute or claim." : 'לצורך הגנה על זכויותיה המשפטיות של החברה במקרה של מחלוקת או תביעה.'}</li>
                </ul>

                <h2>{isEn ? 'Cookies' : 'עוגיות (Cookies)'}</h2>
                <p>
                    {isEn
                        ? 'The website uses Cookies for its ongoing operation, data security and adapting the website to your personal preferences. You can block or delete Cookies through your browser settings, but this may affect some of the user experience on the website.'
                        : 'האתר משתמש בקבצי Cookies לצורך תפעולו השוטף, אבטחת נתונים והתאמת האתר להעדפותיך האישיות. באפשרותך לחסום או למחוק את קבצי ה-Cookies דרך הגדרות הדפדפן שלך, אך הדבר עלול לפגוע בחלק מחוויית השימוש באתר.'}
                </p>
            </section>
        </div>
    );
};