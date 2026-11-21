import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useLanguage } from '../hooks/useLanguage'
import { Icons } from '../cmps/Icons'
import { ContactSection } from '../cmps/ContactSection'

export const CartPage: React.FC = () => {
    const {
        items,
        totalCount,
        subtotal,
        hasPrices,
        isSupplier,
        removeItem,
        updateQuantity,
        clearCart,
        buildWhatsAppQuoteUrl,
    } = useCart()
    const { language } = useLanguage()
    const isEn = language === 'en'
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="cart-page" dir={isEn ? 'ltr' : 'rtl'}>
            <section className="cart-page-container">
                <header className="cart-page-header">
                    <div>
                        <h1 className="cart-page-title">
                            {isEn ? 'Product Cart' : 'סל מוצרים'}
                            {totalCount > 0 && <span> ({totalCount})</span>}
                        </h1>
                    </div>
                    {items.length > 0 && (
                        <button
                            type="button"
                            className="cart-clear-btn"
                            onClick={clearCart}
                        >
                            {isEn ? 'Clear Cart' : 'רוקן סל'}
                        </button>
                    )}
                </header>

                <div className="cart-page-notice">
                    <p>
                        <strong>{isEn ? 'Please Note:' : 'שימו לב:'}</strong>{' '}
                        {isEn
                            ? 'Direct online purchasing is not available. For your convenience, all items added to the cart are compiled for a price quote prior to placing your order with the business.'
                            : 'לא ניתן לרכוש ישירות באתר. לנוחיותכם, כל המוצרים המתווספים לסל המוצרים הינם לצורך קבלת הצעת מחיר לפני ביצוע ההזמנה מול העסק.'}
                    </p>
                </div>

                {items.length === 0 ? (
                    <div className="cart-page-empty">
                        <Icons iconName="cart" />
                        <p>{isEn ? 'Your product cart is currently empty.' : 'סל המוצרים שלך ריק כרגע.'}</p>
                        <button
                            type="button"
                            className="cart-continue-btn"
                            onClick={() => navigate('/product/category/all')}
                        >
                            {isEn ? 'Explore Lighting Collection' : 'לצפייה בקולקציית גופי התאורה'}
                        </button>
                    </div>
                ) : (
                    <div className="cart-page-grid">
                        <ul className="cart-page-items">
                            {items.map((item) => {
                                const title = isEn ? item.name.en || item.name.he : item.name.he || item.name.en
                                const woodLabel =
                                    item.wood && item.wood.en?.toLowerCase() !== 'no wood'
                                        ? isEn
                                            ? item.wood.en
                                            : item.wood.he
                                        : ''
                                const showItemPrice = hasPrices && typeof item.unitPrice === 'number'

                                return (
                                    <li key={item.id} className="cart-page-row">
                                        <div
                                            className="cart-page-thumb"
                                            onClick={() => navigate(`/product/${item.productId}`)}
                                        >
                                            {item.image ? (
                                                <img src={item.image} alt={title} />
                                            ) : (
                                                <div className="cart-item-no-img">
                                                    {isEn ? 'No photo' : 'אין תמונה'}
                                                </div>
                                            )}
                                        </div>

                                        <div className="cart-page-info">
                                            <button
                                                type="button"
                                                className="cart-item-name"
                                                onClick={() => navigate(`/product/${item.productId}`)}
                                            >
                                                {title}
                                            </button>

                                            <div className="cart-item-specs">
                                                {woodLabel && (
                                                    <span>
                                                        {isEn ? 'Finish:' : 'גימור:'} {woodLabel}
                                                    </span>
                                                )}
                                                {item.size && (
                                                    <span>
                                                        {isEn ? 'Size:' : 'מידה:'} {item.size}
                                                    </span>
                                                )}
                                                {item.sku && (
                                                    <span>
                                                        {isEn ? 'SKU:' : 'מק"ט:'} {item.sku}
                                                    </span>
                                                )}
                                            </div>

                                            {showItemPrice && (
                                                <div className="cart-item-price" dir="ltr">
                                                    ₪{(item.unitPrice! * item.quantity).toLocaleString()}
                                                    {item.quantity > 1 && (
                                                        <span className="cart-item-unit-price">
                                                            {' '}
                                                            (₪{item.unitPrice!.toLocaleString()} × {item.quantity})
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="cart-page-row-actions">
                                            <div className="cart-qty-control">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    aria-label={isEn ? 'Decrease quantity' : 'הפחת כמות'}
                                                >
                                                    −
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    aria-label={isEn ? 'Increase quantity' : 'הוסף כמות'}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                className="cart-item-remove"
                                                onClick={() => removeItem(item.id)}
                                                aria-label={isEn ? 'Remove item' : 'הסר פריט'}
                                            >
                                                <Icons iconName="trash" />
                                            </button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>

                        <aside className="cart-page-summary">
                            <h3>{isEn ? 'Quote Summary' : 'סיכום בקשה להצעת מחיר'}</h3>
                            <div className="cart-summary-line">
                                <span>{isEn ? 'Total Items:' : 'סה"כ פריטים:'}</span>
                                <strong>{totalCount}</strong>
                            </div>

                            {hasPrices && subtotal !== null && (
                                <div className="cart-subtotal-box">
                                    <div className="cart-subtotal-row">
                                        <span>{isEn ? 'Estimated Total:' : 'סה"כ משוער:'}</span>
                                        <strong dir="ltr">₪{subtotal.toLocaleString()}</strong>
                                    </div>
                                    {isSupplier && (
                                        <span className="cart-vat-note">
                                            * {isEn ? 'Prices do not include VAT' : 'המחירים אינם כוללים מע"מ'}
                                        </span>
                                    )}
                                </div>
                            )}

                            <a
                                href={buildWhatsAppQuoteUrl(isEn)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cart-whatsapp-btn"
                            >
                                <Icons iconName="whatsapp" />
                                <span>
                                    {isEn
                                        ? 'Request Price Quote'
                                        : 'בקשה להצעת מחיר'}
                                </span>
                            </a>

                            <button
                                type="button"
                                className="cart-view-page-btn"
                                onClick={() => navigate('/product/category/all')}
                            >
                                {isEn ? 'Continue Browsing' : 'המשך לצפייה בקטלוג'}
                            </button>
                        </aside>
                    </div>
                )}
            </section>

            <ContactSection />
        </div>
    )
}
