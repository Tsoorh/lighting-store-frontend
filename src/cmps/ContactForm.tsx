import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { useLanguage } from '../hooks/useLanguage';
import { Icons } from './Icons';

export const ContactForm = () => {
    const { language } = useLanguage();
    const isEn = language === 'en';
    const formRef = useRef<HTMLFormElement>(null);
    const [isSending, setIsSending] = useState(false);

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSending(true);

        emailjs.sendForm('service_rsz9i6w', 'template_z8f4n1s', formRef.current!, 'yAuIkyv81PNA0560i')
            .then(() => {
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
        <form ref={formRef} className="contact-form" onSubmit={sendEmail}>
            <div className="contact-form-row">
                <div className="contact-form-col">
                    <input type="text" name="name" dir={isEn ? 'ltr' : 'rtl'} placeholder={isEn ? 'Name' : 'שם'} aria-label={isEn ? 'Name' : 'שם'} className="contact-form-input" />
                    <input type="tel" name="phone" dir={isEn ? 'ltr' : 'rtl'} placeholder={isEn ? 'Phone' : 'טלפון'} aria-label={isEn ? 'Phone' : 'טלפון'} className="contact-form-input" />
                </div>
                <div className="contact-form-col">
                    <input type="email" name="email" dir={isEn ? 'ltr' : 'rtl'} placeholder={isEn ? 'Email' : 'אימייל'} aria-label={isEn ? 'Email' : 'אימייל'} className="contact-form-input" />
                    <input type="text" name="message" dir={isEn ? 'ltr' : 'rtl'} placeholder={isEn ? 'Message' : 'פניה'} aria-label={isEn ? 'Message' : 'פניה'} className="contact-form-input" />
                </div>
            </div>
            <button className="contact-submit-btn" type="submit" disabled={isSending}>
                <span>{isSending ? (isEn ? 'Sending...' : 'שולח...') : (isEn ? 'Send' : 'שליחה')}</span>
                <Icons iconName={isEn ? 'next' : 'back'} />
            </button>
        </form>
    );
};