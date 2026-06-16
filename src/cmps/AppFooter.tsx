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
            <span>
                {isEn 
                    ? 'Built by Tsoor Hartuv' 
                    : 'האתר נבנה ע״י צור הרטוב'}
            </span>
        </footer>
    );
};