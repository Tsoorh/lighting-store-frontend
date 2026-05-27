import { Icons } from './Icons';
import '../assets/styles/cmps/ContactSection.css';
import { useLanguage } from '../hooks/useLanguage';

export const ContactSection = () => {
    const { language } = useLanguage()
    const isEn = language === 'en'

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
                                <a href="#" target="_blank" rel="noopener noreferrer"><Icons iconName="facebook" /></a>
                                <a href="#" target="_blank" rel="noopener noreferrer"><Icons iconName="instagram" /></a>
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
                        <form className="contact-form">
                            <div className="contact-form-row">
                                <div className="contact-form-col">
                                    <input type="text" placeholder={isEn ? 'Name' : 'שם'} className="contact-form-input" />
                                    <input type="tel" placeholder={isEn ? 'Phone' : 'טלפון'} className="contact-form-input" />
                                </div>
                                <div className="contact-form-col">
                                    <input type="email" placeholder={isEn ? 'Email' : 'אימייל'} className="contact-form-input" />
                                    <input type="text" placeholder={isEn ? 'Message' : 'פניה'} className="contact-form-input" />
                                </div>
                            </div>
                            <button className="contact-submit-btn" type="submit" onClick={(e) => e.preventDefault()}>
                                <span>{isEn ? 'Send' : 'שליחה'}</span>
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