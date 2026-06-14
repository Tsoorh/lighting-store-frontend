import { useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import '../assets/styles/pages/LegalPage.css';
import { Icons } from '../cmps/Icons';
import { useNavigate } from 'react-router-dom';

export const TermsOfUse = () => {
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
                <h1>{isEn ? 'Terms and Conditions of Use' : 'תקנון האתר ותנאי שימוש'}</h1>
                
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

                <h2>{isEn ? '1. Nature of Activity on the Website – Display Website' : '1. אופי הפעילות באתר – אתר תצוגה'}</h2>
                <ul>
                    <li>
                        {isEn 
                            ? <span><strong>The website is a display and information website only</strong>, and does not constitute a virtual store for direct or online purchasing.</span>
                            : <span>האתר הינו <strong>אתר תצוגה ואינפורמציה בלבד</strong>, ואינו מהווה חנות וירטואלית לרכישה ישירה או מקוונת.</span>}
                    </li>
                    <li>
                        {isEn
                            ? 'The images, specifications, and models presented on the website are intended for impression, illustration, and inspiration only regarding the company\'s design and production capabilities.'
                            : 'התמונות, המפרטים והדגמים המוצגים באתר נועדו להתרשמות, המחשה ומתן השראה בלבד לגבי יכולות העיצוב והייצור של החברה.'}
                    </li>
                    <li>
                        {isEn
                            ? 'Every order of a lighting fixture is carried out individually, after characterizing requirements, coordinating specifications, and receiving a personalized written price quote outside the confines of the website.'
                            : 'כל הזמנה של גוף תאורה מתבצעת באופן פרטני, לאחר אפיון דרישות, תיאום מפרט וקבלת הצעת מחיר אישית בכתב ומחוץ לכותלי האתר.'}
                    </li>
                </ul>

                <h2>{isEn ? '2. Custom Made Production and Cancellation Policy' : '2. ייצור בהתאמה אישית (Custom Made) ומדיניות ביטולים'}</h2>
                <ul>
                    <li>
                        {isEn
                            ? 'All lighting fixtures are designed, planned, and manufactured with personal and unique customization for each and every customer (Tailor-Made).'
                            : 'כל גופי התאורה מעוצבים, מתוכננים ומיוצרים בהתאמה אישית וייחודית עבור כל לקוח ולקוח (Tailor-Made).'}
                    </li>
                    <li>
                        {isEn
                            ? <span>In accordance with the Consumer Protection Regulations (Cancellation of a Transaction), 2010, <strong>there is no right of cancellation, exchange, or return for products manufactured specifically for the consumer.</strong></span>
                            : <span>בהתאם לתקנות הגנת הצרכן (ביטול עסקה), תשע"א-2010, <strong>לא חלה זכות ביטול, החלפה או החזרה על מוצרים שיוצרו במיוחד עבור הצרכן.</strong></span>}
                    </li>
                    <li>
                        {isEn
                            ? <span>Due to the unique nature of the products, after the approval of the price quote - <strong>the order cannot be canceled, specifications changed, or a refund received.</strong></span>
                            : <span>לאור אופיים הייחודי של המוצרים, לאחר אישור הצעת המחיר – <strong>לא ניתן לבטל את ההזמנה, לשנות את המפרט או לקבל החזר כספי.</strong></span>}
                    </li>
                    <li>
                        {isEn
                            ? 'It is the responsibility of the ordering party (or a designer/architect on their behalf) to verify the accuracy of measurements, shades, types of raw materials, and their suitability for the designated space before approving the order for production.'
                            : 'באחריות המזמין (או מעצב/אדריכל מטעמו) לוודא את דיוק המידות, הגוונים, סוגי חומרי הגלם והתאמתם לחלל המיועד בטרם אישור ההזמנה לייצור.'}
                    </li>
                    <li>
                        {isEn
                            ? 'Prices do not include bulbs.'
                            : 'המחירים אינם כוללים נורות.'}
                    </li>
                </ul>

                <h2>{isEn ? '3. Intellectual Property' : '3. קניין רוחני'}</h2>
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

                <h2>{isEn ? '4. Limitation of Liability' : '4. הגבלת אחריות'}</h2>
                <ul>
                    <li>
                        {isEn
                            ? 'The Website Management makes every effort to ensure that the information presented on the website (including lighting specifications, lamp holders and end equipment) is accurate and updated. However, since it involves handmade work and varying raw materials, there may be errors, inaccuracies in good faith, or slight differences in shade and texture between the images and the final product. The images on the website are for illustration purposes only.'
                            : 'הנהלת האתר עושה כל מאמץ כדי להבטיח שהמידע המוצג באתר (כולל מפרטי תאורה, בתי מנורה וציוד קצה) יהיה מדויק ומעודכן. עם זאת, מאחר ומדובר בעבודת יד ובחומרי גלם משתנים, ייתכנו שגיאות, אי-דיוקים בתום לב או הבדלי גוון ומרקם קלים בין התמונות למוצר הסופי. התמונות באתר הן להמחשה בלבד.'}
                    </li>
                    <li>
                        {isEn
                            ? 'The Company shall not be liable for any direct or indirect damage caused by reliance on the information on the website. The binding specification is solely the technical specification that will be approved in writing within the framework of the individual price quote.'
                            : 'החברה לא תישא באחריות לכל נזק ישיר או עקיף שייגרם כתוצאה מהסתמכות על המידע באתר. המפרט המחייב הינו אך ורק המפרט הטכני שיאושר בכתב במסגרת הצעת המחיר הפרטנית.'}
                    </li>
                    <li>
                        {isEn
                            ? <span>The Company shall not be liable for any damage resulting from improper use of the products or negligent installation. <strong>Installation of electrical and lighting equipment must be performed by a qualified electrician only and in accordance with the law.</strong></span>
                            : <span>החברה לא תישא באחריות לכל נזק שייגרם כתוצאה משימוש לא נכון במוצרים או התקנה רשלנית. <strong>התקנת ציוד חשמל ותאורה חייבת להתבצע על ידי חשמלאי מוסמך בלבד ובהתאם לחוק.</strong></span>}
                    </li>
                    <li>
                        {isEn
                            ? 'The website may contain links to external websites. The Company is not responsible for the content of these websites or for any damage caused by using them.'
                            : 'האתר עשוי להכיל קישורים לאתרי אינטרנט חיצוניים. החברה אינה אחראית לתוכן אתרים אלו או לכל נזק שייגרם מהשימוש בהם.'}
                    </li>
                </ul>

                <h2>{isEn ? '5. Changes to the Website and Discontinuation of Service' : '5. שינויים באתר והפסקת שירות'}</h2>
                <p>
                    {isEn
                        ? 'The Website Management reserves the right to update, change or discontinue the operation of the website (or parts thereof) at any time, without prior notice, as well as to update these terms of use from time to time.'
                        : 'הנהלת האתר שומרת לעצמה את הזכות לעדכן, לשנות או להפסיק את פעילות האתר (או חלקים ממנו) בכל עת, ללא הודעה מראש, וכן לעדכן תנאי שימוש אלו מעת לעת.'}
                </p>

                <h2>{isEn ? '6. Jurisdiction' : '6. סמכות שיפוט'}</h2>
                <p>
                    {isEn
                        ? 'These terms shall be governed solely by the laws of the State of Israel. The exclusive jurisdiction in any matter relating to this agreement or the use of the website shall be given to the competent court in the Central District.'
                        : 'על תנאים אלו יחולו דיני מדינת ישראל בלבד. סמכות השיפוט הבלעדית בכל עניין הנוגע להסכם זה או לשימוש באתר תהיה לבית המשפט המוסמך במחוז המרכז.'}
                </p>
            </section>
        </div>
    );
};