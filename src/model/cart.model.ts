import type { hebrewEnglishObj } from './product.model'

export interface CartItem {
    id: string
    productId: string
    name: hebrewEnglishObj
    image: string
    wood?: hebrewEnglishObj
    size?: string
    sku?: string
    quantity: number
    unitPrice?: number
}

export interface CartContextValue {
    items: CartItem[]
    totalCount: number
    subtotal: number | null
    hasPrices: boolean
    isSupplier: boolean
    isCartOpen: boolean
    openCart: () => void
    closeCart: () => void
    addItem: (item: Omit<CartItem, 'id'>) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    buildWhatsAppQuoteUrl: (isEn: boolean) => string
}
