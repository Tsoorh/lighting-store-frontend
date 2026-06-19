import { useLanguage } from '../hooks/useLanguage';
import { Icons } from './Icons';

interface ContactDetailsProps {
    showTitle?: boolean;
}

export const ContactDetails = ({ showTitle = true }: ContactDetailsProps) => {
    const { language } = useLanguage();
    const isEn = language === 'en';

    return (
        <>
            <div className="contact-title-group">
                {showTitle && <h3 className="contact-title">{isEn ? 'Contact Us' : 'יצירת קשר'}</h3>}
                <div className="contact-socials">
                    <a href={`https://wa.me/972524000102?text=${encodeURIComponent(
                        isEn 
                            ? "Hi, I would like to get more information." 
                            : "היי, אשמח לקבל פרטים נוספים."
                    )}`} target="_blank" rel="noopener noreferrer" aria-label={isEn ? "Contact us on WhatsApp" : "צור קשר בוואטסאפ"}><Icons iconName="whatsapp" /></a>
                    <a href="https://www.facebook.com/profile.php?id=61579487155503" target="_blank" rel="noopener noreferrer" aria-label={isEn ? "Visit our Facebook page" : "בקר בעמוד הפייסבוק שלנו"}><Icons iconName="facebook" /></a>
                    <a href="https://www.instagram.com/tiran.lasry?igsh=M3A1NDA0bTdmaGR5" target="_blank" rel="noopener noreferrer" aria-label={isEn ? "Visit our Instagram page" : "בקר בעמוד האינסטגרם שלנו"}><Icons iconName="instagram" /></a>
                    <a href="mailto:tiranlasry@gmail.com" aria-label={isEn ? "Send us an email" : "שלח לנו אימייל"}><Icons iconName="gmail" /></a>
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
        </>
    );
};