import React from 'react'
import type { hebrewEnglishObj } from '../../model/product.model'
import { matchesWood, type ProductPrice } from '../../utils/product-healer'

interface ProductPriceEditorProps {
    prices: ProductPrice[]
    availableWoodOptions: hebrewEnglishObj[]
    isEn: boolean
    onToggleWoodPrice: (wood: hebrewEnglishObj) => void
    onPriceChange: (index: number, field: 'amount' | 'size' | 'sku', value: number | string) => void
    onAddVariant: (wood: hebrewEnglishObj) => void
    onRemoveVariant: (index: number) => void
}

export const ProductPriceEditor: React.FC<ProductPriceEditorProps> = ({
    prices,
    availableWoodOptions,
    isEn,
    onToggleWoodPrice,
    onPriceChange,
    onAddVariant,
    onRemoveVariant
}) => {
    const activeWoodOptions = availableWoodOptions.filter(wood =>
        prices.some(p => matchesWood(p.wood, wood))
    )

    return (
        <div className="form-section">
            <h4>{isEn ? 'Prices by Wood Type' : 'מחירים לפי סוג עץ'}</h4>
            <div className="wood-price-toggles">
                {availableWoodOptions.map(wood => {
                    const isSelected = prices.some(p => matchesWood(p.wood, wood))
                    return (
                        <label
                            key={wood.en}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                padding: '8px',
                                background: isSelected ? '#f0f7ff' : '#f9f9f9',
                                borderRadius: '4px',
                                border: `1px solid ${isSelected ? '#007bff' : '#ddd'}`
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => onToggleWoodPrice(wood)}
                                style={{ width: '18px', height: '18px' }}
                            />
                            {isEn ? wood.en : wood.he}
                        </label>
                    )
                })}
            </div>

            {activeWoodOptions.map(wood => {
                const woodPrices = prices
                    .map((p, originalIdx) => ({ ...p, originalIdx }))
                    .filter(p => matchesWood(p.wood, wood))

                return (
                    <div
                        key={wood.en}
                        className="wood-group"
                        style={{
                            marginBottom: '20px',
                            padding: '15px',
                            background: '#fcfcfc',
                            border: '1px solid #eee',
                            borderRadius: '8px'
                        }}
                    >
                        <h5
                            style={{
                                marginTop: 0,
                                marginBottom: '15px',
                                color: '#333',
                                borderBottom: '1px solid #eee',
                                paddingBottom: '5px'
                            }}
                        >
                            {isEn ? wood.en : wood.he}
                        </h5>
                        {woodPrices.map(p => (
                            <div key={p.originalIdx} className="price-row-grid">
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                                        {isEn ? 'SKU / מקט (Optional)' : 'מקט / SKU (אופציונלי)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={p.sku || ''}
                                        onChange={(e) => onPriceChange(p.originalIdx, 'sku', e.target.value)}
                                        placeholder={isEn ? 'e.g. TL-101' : 'למשל TL-101'}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                                        {isEn ? 'Size Label (Optional)' : 'תווית מידה (אופציונלי)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={p.size || ''}
                                        onChange={(e) => onPriceChange(p.originalIdx, 'size', e.target.value)}
                                        placeholder={isEn ? 'e.g. 12cm' : 'למשל 12 ס"מ'}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                                        {isEn ? 'Amount' : 'מחיר'}
                                    </label>
                                    <input
                                        type="number"
                                        value={p.amount !== undefined && p.amount !== null ? p.amount : ''}
                                        onChange={(e) => onPriceChange(p.originalIdx, 'amount', e.target.value === '' ? 0 : +e.target.value)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onRemoveVariant(p.originalIdx)}
                                    style={{
                                        padding: '8px 12px',
                                        background: '#fff',
                                        color: '#ff4444',
                                        border: '1px solid #ff4444',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                    title={isEn ? 'Remove Variant' : 'הסר גרסה'}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => onAddVariant(wood)}
                            style={{
                                background: 'none',
                                border: '1px dashed #ccc',
                                color: '#666',
                                padding: '8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                width: '100%',
                                fontSize: '0.85rem'
                            }}
                        >
                            + {isEn ? 'Add another size for ' : 'הוסף מידה נוספת ל-'}{isEn ? wood.en : wood.he}
                        </button>
                    </div>
                )
            })}

            {availableWoodOptions.length === 0 && (
                <p style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic' }}>
                    {isEn ? 'Select wood types in "Wood Types" section first' : 'בחר סוגי עץ במקטע "סוגי עץ" תחילה'}
                </p>
            )}
        </div>
    )
}
