import '../assets/styles/cmps/ContactSection.css';
import { useLanguage } from '../hooks/useLanguage';
import { ContactForm } from './ContactForm';
import { ContactDetails } from './ContactDetails';
import { Link } from 'react-router-dom';

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
                        <ContactDetails />
                    </div>
                    <div className="contact-top-inner-left">
                        <ContactForm />
                    </div>
                </div>
            </div>
            <div className="contact-bottom">
                <Link to="/terms" className="contact-bottom-link terms-link">{isEn ? 'Terms of Use' : 'תנאי שימוש'}</Link>
                <Link to="/privacy" className="contact-bottom-link privacy-link">{isEn ? 'Privacy Policy' : 'מדיניות פרטיות'}</Link>
                <Link to="/accessibility" className="contact-bottom-link accessibility-link">{isEn ? 'Accessibility Statement' : 'הצהרת נגישות'}</Link>
            </div>
        </section>
    )
}