import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Icons } from '../Icons';
import '../../assets/styles/cmps/ShareModal.css';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    productUrl: string;
    productImage?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
    isOpen,
    onClose,
    productName,
    productUrl,
    productImage
}) => {
    const { language } = useLanguage();
    const isEnglish = language === 'en';
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const shareText = isEnglish
        ? `Check out the "${productName}" lighting fixture by Tiran Lasry: ${productUrl}`
        : `כדאי לראות את גוף התאורה "${productName}" של טירן לסרי: ${productUrl}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    const onCopy = async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(productUrl);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = productUrl;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    return (
        <div 
            className="share-modal-overlay" 
            onClick={onClose} 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="share-modal-title"
        >
            <div 
                className="share-modal-content" 
                onClick={(e) => e.stopPropagation()} 
                dir={isEnglish ? 'ltr' : 'rtl'}
            >
                <div className="share-modal-header">
                    <h3 id="share-modal-title">
                        {isEnglish ? 'Share Product' : 'שיתוף מוצר'}
                    </h3>
                    <button 
                        className="share-modal-close-btn" 
                        onClick={onClose}
                        aria-label={isEnglish ? 'Close' : 'סגור'}
                    >
                        <Icons iconName="close" />
                    </button>
                </div>

                <div className="share-modal-product-preview">
                    {productImage && (
                        <img 
                            src={productImage} 
                            alt={productName} 
                            className="share-modal-thumbnail" 
                        />
                    )}
                    <div className="share-modal-product-info">
                        <span className="share-modal-product-name">{productName}</span>
                        <span className="share-modal-product-brand">Tiran Lasry</span>
                    </div>
                </div>

                <div className="share-modal-actions">
                    <a 
                        href={whatsappUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="share-action-btn whatsapp-share-btn"
                        onClick={onClose}
                    >
                        <span className="share-action-icon whatsapp-icon">
                            <Icons iconName="whatsapp" />
                        </span>
                        <span className="share-action-label">
                            {isEnglish ? 'Share on WhatsApp' : 'שיתוף בוואטסאפ'}
                        </span>
                    </a>

                    <div className="share-link-copy-container">
                        <input 
                            type="text" 
                            value={productUrl} 
                            readOnly 
                            className="share-link-input"
                            onFocus={(e) => e.target.select()}
                        />
                        <button 
                            className={`share-copy-btn ${copied ? 'copied' : ''}`} 
                            onClick={onCopy}
                            type="button"
                            aria-label={isEnglish ? 'Copy link' : 'העתק קישור'}
                        >
                            <Icons iconName={copied ? 'check' : 'copy'} />
                            <span>{copied ? (isEnglish ? 'Copied!' : 'הועתק!') : (isEnglish ? 'Copy' : 'העתק')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

