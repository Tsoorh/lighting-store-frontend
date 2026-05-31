import { useLanguage } from '../hooks/useLanguage';
import { ContactForm } from '../cmps/ContactForm';
import { ContactDetails } from '../cmps/ContactDetails';
import '../assets/styles/cmps/ContactSection.css';
import '../assets/styles/pages/Contact.css';

export const Contact = () => {
    const { language } = useLanguage();
    const isEn = language === 'en';

    return (
        <section className="contact-page" dir={isEn ? 'ltr' : 'rtl'}>
            <div className="contact-page-top-wrapper theme-dark">
                <div className="contact-page-top">
                    <div className="contact-page-top-right">
                        <img src="/images/Figma/ContactPageLight.png" alt="Contact Light" className="contact-page-img" />
                    </div>
                    
                    <div className="contact-page-top-left">
                        <div className="contact-top-inner-left">
                            <h3 className="contact-title">{isEn ? 'Contact Us' : 'יצירת קשר'}</h3>
                            <ContactForm />
                        </div>
                        
                        <div className="contact-top-inner-right">
                            <ContactDetails showTitle={false} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="contact-bottom">
                <a href="#terms" className="contact-bottom-link terms-link">{isEn ? 'Terms of Use' : 'תנאי שימוש'}</a>
                <a href="#privacy" className="contact-bottom-link privacy-link">{isEn ? 'Privacy Policy' : 'מדיניות פרטיות'}</a>
                <a href="#accessibility" className="contact-bottom-link accessibility-link">{isEn ? 'Accessibility Statement' : 'הצהרת נגישות'}</a>
            </div>
        </section>
    );
};