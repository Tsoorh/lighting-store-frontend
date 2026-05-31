import { Icons } from './Icons';
import '../assets/styles/cmps/ContactSection.css';
import { useLanguage } from '../hooks/useLanguage';
import { useRef, useState } from 'react';
// כדי להשתמש בזה, תצטרך להתקין את הספריה: npm install @emailjs/browser
import emailjs from '@emailjs/browser';

export const ContactSection = () => {
    const { language } = useLanguage()
    const isEn = language === 'en'
    const formRef = useRef<HTMLFormElement>(null);
    const [isSending, setIsSending] = useState(false);

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSending(true);

        // יש להחליף את המחרוזות האלה בפרטים מהחשבון שלך ב- EmailJS
        //.ENV -> EMAILJS_SERVICEID, EMAILJS_TEMPLATEID, EMAILJS_PUBLICID
        emailjs.sendForm('service_rsz9i6w', 'template_z8f4n1s', formRef.current!, 'yAuIkyv81PNA0560i')
            .then(() => {
                // שליחת הודעת תגובה אוטומטית ללקוח ברקע
                emailjs.sendForm('service_rsz9i6w', 'template_p56mtkk', formRef.current!, 'yAuIkyv81PNA0560i')
                    .catch(err => console.error('Auto-reply failed:', err));

                alert(isEn ? 'Message sent successfully!' : 'הפנייה נשלחה בהצלחה!');
                formRef.current?.reset();
            })
            .catch((error) => {
                alert(isEn ? 'Failed to send message.' : 'אירעה שגיאה בשליחת הפנייה.');
                console.error(error);
            })
            .finally(() => setIsSending(false));
    };

    return (
        <section className="contact-sec page-section" dir={isEn ? 'ltr' : 'rtl'}>
            <div className="contact-top">
                <div className="contact-top-right">
                    <img src="/images/Figma/T_bright_logo.png" alt="Background Logo" className="cover-img" />
                </div>
                <div className="contact-top-left">
                    <div className="contact-top-inner-right">
                        <div className="contact-title-group">
                            <h3 className="contact-title">{isEn ? 'Contact Us' : 'יצירת קשר'}</h3>
                            <div className="contact-socials">
                                <a href="https://wa.me/972524000102" target="_blank" rel="noopener noreferrer"><Icons iconName="whatsapp" /></a>
                                <a href="https://www.facebook.com/profile.php?id=61579487155503" target="_blank" rel="noopener noreferrer"><Icons iconName="facebook" /></a>
                                <a href="#" target="_blank" rel="noopener noreferrer"><Icons iconName="instagram" /></a>
                                <a href="mailto:tiranlasry@gmail.com"><Icons iconName="gmail" /></a>
                            </div>
                        </div>
                        <div className="contact-details">
                            <span className="contact-detail-text">{isEn ? 'Tiran Lasry' : 'טירן לסרי'}</span>
                            <span className="contact-detail-text">{isEn ? 'HaMazmera 7, Ness Ziona, Israel' : 'המזמרה 7, נס ציונה, ישראל'}</span>
                            <div className="contact-contact-row">
                                <span className="contact-detail-text" dir="ltr">052-40-00-102</span>
                                <span className="contact-detail-text">Tiranlasry@gmail.com</span>
                            </div>
                        </div>
                    </div>
                    <div className="contact-top-inner-left">
                        <form ref={formRef} className="contact-form" onSubmit={sendEmail}>
                            <div className="contact-form-row">
                                <div className="contact-form-col">
                                    <input type="text" name="name" dir={isEn ? 'ltr' : 'rtl'} placeholder={isEn ? 'Name' : 'שם'} className="contact-form-input" />
                                    <input type="tel" name="phone" dir={isEn ? 'ltr' : 'rtl'} placeholder={isEn ? 'Phone' : 'טלפון'} className="contact-form-input" />
                                </div>
                                <div className="contact-form-col">
                                    <input type="email" name="email" dir={isEn ? 'ltr' : 'rtl'} placeholder={isEn ? 'Email' : 'אימייל'} className="contact-form-input" />
                                    <input type="text" name="message" dir={isEn ? 'ltr' : 'rtl'} placeholder={isEn ? 'Message' : 'פניה'} className="contact-form-input" />
                                </div>
                            </div>
                            <button className="contact-submit-btn" type="submit" disabled={isSending}>
                                <span>{isSending ? (isEn ? 'Sending...' : 'שולח...') : (isEn ? 'Snd' : 'שליחה')}</span>
                                <Icons iconName={isEn ? 'next' : 'back'} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="contact-bottom">
                <a href="#terms" className="contact-bottom-link terms-link">{isEn ? 'Terms of Use' : 'תנאי שימוש'}</a>
                <a href="#privacy" className="contact-bottom-link privacy-link">{isEn ? 'Privacy Policy' : 'מדיניות פרטיות'}</a>
                <a href="#accessibility" className="contact-bottom-link accessibility-link">{isEn ? 'Accessibility Statement' : 'הצהרת נגישות'}</a>
            </div>
        </section>
    )
}