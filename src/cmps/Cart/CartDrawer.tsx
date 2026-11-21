import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useLanguage } from '../../hooks/useLanguage'
import { Icons } from '../Icons'

export const CartDrawer: React.FC = () => {
    const {
        items,
        totalCount,
        subtotal,
        hasPrices,
        isSupplier,
        isCartOpen,
        closeCart,
        removeItem,
        updateQuantity,
        buildWhatsAppQuoteUrl,
    } = useCart()
    const { language } = useLanguage()
    const isEn = language === 'en'
    const navigate = useNavigate()

    useEffect(() => {
        if (!isCartOpen) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeCart()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [isCartOpen, closeCart])

    if (!isCartOpen) return null

    return (
        <div
            className="cart-drawer-backdrop"
            onClick={closeCart}
            role="dialog"
            aria-modal="true"
            aria-label={isEn ? 'Quote Cart' : 'סל מוצרים'}
        >
            <aside
                className={`cart-drawer ${isEn ? 'ltr' : 'rtl'}`}
                dir={isEn ? 'ltr' : 'rtl'}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="cart-drawer-header">
                    <div className="cart-drawer-title-group">
                        <Icons iconName="cart" />
                        <h2>
                            {isEn ? 'Product Cart' : 'סל מוצרים'}
                            {totalCount > 0 && (
                                <span className="cart-drawer-count">
                                    ({totalCount})
                                </span>
                            )}
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="cart-drawer-close"
                        onClick={closeCart}
                        aria-label={isEn ? 'Close cart' : 'סגור סל'}
                    >
                        <Icons iconName="close" />
                    </button>
                </header>

                <div className="cart-notice-banner">
                    <p>
                        <strong>{isEn ? 'Please Note:' : 'שימו לב:'}</strong>{' '}
                        {isEn
                            ? 'Direct online purchasing is not available. For your convenience, all items added to the cart are compiled for a price quote prior to placing your order with the business.'
                            : 'לא ניתן לרכוש ישירות באתר. לנוחיותכם, כל המוצרים המתווספים לסל המוצרים הינם לצורך קבלת הצעת מחיר לפני ביצוע ההזמנה מול העסק.'}
                    </p>
                </div>

                <div className="cart-drawer-body">
                    {items.length === 0 ? (
                        <div className="cart-empty-state">
                            <Icons iconName="cart" />
                            <p>{isEn ? 'Your cart is currently empty.' : 'סל המוצרים שלך ריק כרגע.'}</p>
                            <button
                                type="button"
                                className="cart-continue-btn"
                                onClick={() => {
                                    closeCart()
                                    navigate('/product/category/all')
                                }}
                            >
                                {isEn ? 'Browse Lighting Collection' : 'לצפייה בקולקציית גופי התאורה'}
                            </button>
                        </div>
                    ) : (
                        <ul className="cart-items-list">
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
                                    <li key={item.id} className="cart-item-card">
                                        <div
                                            className="cart-item-thumb"
                                            onClick={() => {
                                                closeCart()
                                                navigate(`/product/${item.productId}`)
                                            }}
                                        >
                                            {item.image ? (
                                                <img src={item.image} alt={title} />
                                            ) : (
                                                <div className="cart-item-no-img">
                                                    {isEn ? 'No photo' : 'אין תמונה'}
                                                </div>
                                            )}
                                        </div>

                                        <div className="cart-item-details">
                                            <button
                                                type="button"
                                                className="cart-item-name"
                                                onClick={() => {
                                                    closeCart()
                                                    navigate(`/product/${item.productId}`)
                                                }}
                                            >
                                                {title}
                                            </button>

                                            {(woodLabel || item.size || item.sku) && (
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
                                            )}

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

                                            <div className="cart-item-actions">
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
                                                    title={isEn ? 'Remove item' : 'הסר פריט'}
                                                >
                                                    <Icons iconName="trash" />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>

                {items.length > 0 && (
                    <footer className="cart-drawer-footer">
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
                            onClick={() => {
                                closeCart()
                                navigate('/cart')
                            }}
                        >
                            {isEn ? 'View Full Cart Page' : 'לצפייה בעמוד הסל המלא'}
                        </button>
                    </footer>
                )}
            </aside>
        </div>
    )
}
