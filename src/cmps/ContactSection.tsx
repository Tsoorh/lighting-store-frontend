import { Icons } from './Icons';
import '../assets/styles/cmps/ContactSection.css';

export const ContactSection = () => {
    return (
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
    )
}