import { useLanguage } from '../hooks/useLanguage';
import { Icons } from './Icons';
import '../assets/styles/cmps/FloatingWhatsApp.css';

export const FloatingWhatsApp = () => {
    const { language } = useLanguage();
    const isEnglish = language === 'en';

    const phoneNumber = '972547513434';
    const message = isEnglish
        ? "Hi, I reached out through Tiran Lasry's website and would like to get more details."
        : "היי, הגעתי דרך האתר של טירן לסרי ואשמח לקבל פרטים נוספים.";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    const label = isEnglish ? "Chat with us on WhatsApp" : "דברו איתנו בוואטסאפ";

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="floating-whatsapp"
            aria-label={label}
            title={label}
        >
            <Icons iconName="whatsapp" />
        </a>
    );
};
