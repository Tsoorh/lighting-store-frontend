import { useLanguage } from '../hooks/useLanguage';
import '../assets/styles/cmps/AppFooter.css';

export const AppFooter = () => {
    const { language } = useLanguage();
    const isEn = language === 'en';

    return (
        <footer className="app-footer" dir={isEn ? 'ltr' : 'rtl'}>
            <span>
                {isEn 
                    ? '© All rights reserved to Tiran Lasry' 
                    : '© כל הזכויות שמורות לטירן לסרי'}
            </span>
            <a
                href="https://www.tsoorhartov.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-credit-link"
                title={isEn ? 'Tsoor Hartov - Website Building & Development' : 'צור הרטוב - בניית אתרים ופיתוח'}
            >
                <span>{isEn ? 'Built by Tsoor Hartov' : 'האתר נבנה ע״י צור הרטוב'}</span>
                <span className="footer-credit-arrow" aria-hidden="true">↗</span>
            </a>
        </footer>
    );
};