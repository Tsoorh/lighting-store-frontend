import { useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import '../assets/styles/pages/LegalPage.css';

export const TermsOfUse = () => {
    const { language } = useLanguage();
    const isEn = language === 'en';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="legal-layout" dir={isEn ? 'ltr' : 'rtl'}>
            <section className="legal-content">
                <h1>{isEn ? 'Terms of Use' : 'תנאי שימוש באתר'}</h1>
                
                <h2>{isEn ? 'Introduction and General' : 'מבוא וכללי'}</h2>
                <p>
                    {isEn 
                        ? 'Welcome to the "Tiran Lasry" website (hereinafter: "the Website"), operated by Tiran Lasry, PC 22775191 (hereinafter: "the Website Management" or "the Company").'
                        : 'ברוכים הבאים לאתר "טירן לסרי" (להלן: "האתר"), המופעל על ידי טירן לסרי ע.מ. 22775191 (להלן: "הנהלת האתר" או "החברה").'}
                </p>
                <p>
                    {isEn
                        ? 'The use of the website, the content included in it and the services it offers is subject to the full approval and acceptance of the terms of use detailed below. Browsing the website and/or performing actions in it constitutes your consent to these terms. If you do not agree to the terms, please refrain from using the website.'
                        : 'השימוש באתר, בתכנים הכלולים בו ובשירותים שהוא מציע כפוף לאישורם וקבלתם המלאה של תנאי השימוש המפורטים להלן. גלישה באתר ו/או ביצוע פעולות בו מהווים הסכמה מצדך לתנאים אלו. אם אינך מסכים לתנאים, אנא הימנע משימוש באתר.'}
                </p>

                <h2>{isEn ? 'Intellectual Property' : 'קניין רוחני'}</h2>
                <p>
                    {isEn
                        ? 'All rights are reserved to the Company regarding the website design, trademarks, texts, images, product catalog, technical specifications and any other material appearing in it.'
                        : 'כל הזכויות שמורות לחברה בכל הנוגע לעיצוב האתר, סימני המסחר, הטקסטים, התמונות, קטלוג המוצרים, המפרטים הטכניים וכל חומר אחר המופיע בו.'}
                </p>
                <p>
                    {isEn
                        ? 'It is forbidden to copy, reproduce, distribute, sell or make any commercial use of data or content from the website without obtaining explicit prior written approval from the Website Management.'
                        : 'אין להעתיק, לשכפל, להפיץ, למכור או לעשות שימוש מסחרי כלשהו בנתונים או בתכנים מן האתר ללא קבלת אישור מפורש בכתב ומראש מהנהלת האתר.'}
                </p>

                <h2>{isEn ? 'Limitation of Liability' : 'הגבלת אחריות'}</h2>
                <p>
                    {isEn
                        ? 'The Website Management makes every effort to ensure that the information presented on the website (including lighting specifications, lamp holders and end equipment) is accurate and updated. However, there may be errors or inaccuracies in good faith. The images on the website are for illustration purposes only.'
                        : 'הנהלת האתר עושה כל מאמץ כדי להבטיח שהמידע המוצג באתר (כולל מפרטי תאורה, בתי מנורה וציוד קצה) יהיה מדויק ומעודכן. עם זאת, ייתכנו שגיאות או אי-דיוקים בתום לב. התמונות באתר הן להמחשה בלבד.'}
                </p>
                <p>
                    {isEn
                        ? 'The Company shall not be liable for any direct or indirect damage caused by reliance on the information on the website, or resulting from improper use of the purchased products. Installation of electrical and lighting equipment must be performed by a qualified electrician and in accordance with the law.'
                        : 'החברה לא תישא באחריות לכל נזק ישיר או עקיף שייגרם כתוצאה מהסתמכות על המידע באתר, או כתוצאה משימוש לא נכון במוצרים הנרכשים. התקנת ציוד חשמל ותאורה חייבת להתבצע על ידי חשמלאי מוסמך ובהתאם לחוק.'}
                </p>
                <p>
                    {isEn
                        ? 'The website may contain links to external websites. The Company is not responsible for the content of these websites or for any damage caused by using them.'
                        : 'האתר עשוי להכיל קישורים לאתרי אינטרנט חיצוניים. החברה אינה אחראית לתוכן אתרים אלו או לכל נזק שייגרם מהשימוש בהם.'}
                </p>

                <h2>{isEn ? 'Changes to the Website and Discontinuation of Service' : 'שינויים באתר והפסקת שירות'}</h2>
                <p>
                    {isEn
                        ? 'The Website Management reserves the right to update, change or discontinue the operation of the website (or parts thereof) at any time, without prior notice, as well as to update these terms of use from time to time.'
                        : 'הנהלת האתר שומרת לעצמה את הזכות לעדכן, לשנות או להפסיק את פעילות האתר (או חלקים ממנו) בכל עת, ללא הודעה מראש, וכן לעדכן תנאי שימוש אלו מעת לעת.'}
                </p>

                <h2>{isEn ? 'Jurisdiction' : 'סמכות שיפוט'}</h2>
                <p>
                    {isEn
                        ? 'These terms shall be governed solely by the laws of the State of Israel. The exclusive jurisdiction in any matter relating to this agreement shall be given to the competent court in the Central District.'
                        : 'על תנאים אלו יחולו דיני מדינת ישראל בלבד. סמכות השיפוט הבלעדית בכל עניין הנוגע להסכם זה תהיה לבית המשפט המוסמך במחוז המרכז.'}
                </p>
            </section>
        </div>
    );
};