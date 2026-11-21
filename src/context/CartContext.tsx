import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './cart-context'
import type { CartItem } from '../model/cart.model'
import type { Miniuser } from '../model/user.model'
import { authService } from '../services/auth.service'
import { productService } from '../services/product.service'

const CART_STORAGE_KEY = 'tl_cart_items'
const WHATSAPP_PHONE = '972547513434'

function buildCartItemId(item: { productId: string; wood?: { en?: string }; size?: string }): string {
    const woodKey = item.wood?.en?.trim().toLowerCase() || 'default'
    const sizeKey = item.size?.trim().toLowerCase() || 'default'
    return `${item.productId}__${woodKey}__${sizeKey}`
}

function loadStoredCart(): CartItem[] {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return []
        return parsed.filter(
            (it): it is CartItem =>
                Boolean(it && typeof it.id === 'string' && typeof it.productId === 'string' && typeof it.quantity === 'number')
        )
    } catch {
        return []
    }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => loadStoredCart())
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [user, setUser] = useState<Miniuser | null>(() => authService.getLoggedinUser())

    const hasPrices = Boolean(user && user.showPrices !== false)
    const isSupplier = user?.role?.trim().toLowerCase() === 'supplier'

    useEffect(() => {
        const onUserChanged = () => {
            const nextUser = authService.getLoggedinUser()
            setUser(nextUser)
            if (!nextUser || nextUser.showPrices === false) {
                setItems((prev) =>
                    prev.some((it) => it.unitPrice !== undefined)
                        ? prev.map(({ unitPrice: _omit, ...rest }) => {
                              void _omit
                              return rest
                          })
                        : prev
                )
            }
        }
        window.addEventListener('user-changed', onUserChanged)
        return () => window.removeEventListener('user-changed', onUserChanged)
    }, [])

    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
        } catch (err) {
            console.warn('Failed to persist cart to localStorage', err)
        }
    }, [items])

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === CART_STORAGE_KEY) {
                setItems(loadStoredCart())
            }
        }
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [])

    // Hydrate unit prices asynchronously when a logged-in user has price access
    useEffect(() => {
        if (!hasPrices) return

        const missingPriceItems = items.filter((it) => it.unitPrice === undefined)
        if (missingPriceItems.length === 0) return

        let cancelled = false
        async function hydratePrices() {
            const uniqueProductIds = Array.from(new Set(missingPriceItems.map((it) => it.productId)))
            const productMap = new Map<string, Awaited<ReturnType<typeof productService.getById>>>()

            await Promise.all(
                uniqueProductIds.map(async (pid) => {
                    try {
                        const prod = await productService.getById(pid)
                        if (prod) productMap.set(pid, prod)
                    } catch {
                        // ignore individual fetch error
                    }
                })
            )

            if (cancelled || productMap.size === 0) return

            setItems((prev) =>
                prev.map((item) => {
                    if (item.unitPrice !== undefined) return item
                    const prod = productMap.get(item.productId)
                    if (!prod?.price || prod.price.length === 0) return item
                    const matched =
                        prod.price.find(
                            (p) =>
                                (!item.wood?.en || p.wood.en === item.wood.en) &&
                                (!item.size || (p.size || '') === item.size)
                        ) ||
                        prod.price.find((p) => !item.wood?.en || p.wood.en === item.wood.en) ||
                        prod.price[0]

                    if (matched?.amount === undefined) return item
                    return { ...item, unitPrice: matched.amount }
                })
            )
        }

        hydratePrices()
        return () => {
            cancelled = true
        }
    }, [hasPrices, user?._id, items])

    const openCart = useCallback(() => setIsCartOpen(true), [])
    const closeCart = useCallback(() => setIsCartOpen(false), [])

    const addItem = useCallback(
        (newItem: Omit<CartItem, 'id'>) => {
            const id = buildCartItemId(newItem)
            const qtyToAdd = Math.max(1, Math.floor(newItem.quantity || 1))
            setItems((prev) => {
                const existingIdx = prev.findIndex((it) => it.id === id)
                if (existingIdx > -1) {
                    const updated = [...prev]
                    const existing = updated[existingIdx]
                    updated[existingIdx] = {
                        ...existing,
                        quantity: existing.quantity + qtyToAdd,
                        unitPrice: hasPrices ? (newItem.unitPrice ?? existing.unitPrice) : undefined,
                    }
                    return updated
                }
                return [
                    ...prev,
                    {
                        ...newItem,
                        id,
                        quantity: qtyToAdd,
                        unitPrice: hasPrices ? newItem.unitPrice : undefined,
                    },
                ]
            })
            setIsCartOpen(true)
        },
        [hasPrices]
    )

    const removeItem = useCallback((id: string) => {
        setItems((prev) => prev.filter((it) => it.id !== id))
    }, [])

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity <= 0) {
            setItems((prev) => prev.filter((it) => it.id !== id))
            return
        }
        setItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, quantity: Math.floor(quantity) } : it))
        )
    }, [])

    const clearCart = useCallback(() => {
        setItems([])
    }, [])

    const totalCount = useMemo(
        () => items.reduce((sum, it) => sum + it.quantity, 0),
        [items]
    )

    const subtotal = useMemo(() => {
        if (!hasPrices) return null
        let sum = 0
        let hasAnyPrice = false
        for (const it of items) {
            if (typeof it.unitPrice === 'number') {
                sum += it.unitPrice * it.quantity
                hasAnyPrice = true
            }
        }
        return hasAnyPrice ? sum : null
    }, [items, hasPrices])

    const buildWhatsAppQuoteUrl = useCallback(
        (isEn: boolean) => {
            const header = isEn
                ? 'Hi Tiran, I would like to request a price quote for the following items from the website:'
                : 'היי טירן, אשמח לקבל הצעת מחיר עבור הפריטים הבאים מהאתר:'

            const lines = items.map((it, idx) => {
                const title = isEn ? it.name.en || it.name.he : it.name.he || it.name.en
                const parts: string[] = [`${idx + 1}. ${title}`]
                const woodLabel = it.wood
                    ? it.wood.en?.toLowerCase() === 'no wood'
                        ? ''
                        : isEn
                          ? it.wood.en
                          : it.wood.he
                    : ''
                if (woodLabel) {
                    parts.push(isEn ? `Finish: ${woodLabel}` : `גימור: ${woodLabel}`)
                }
                if (it.size) {
                    parts.push(isEn ? `Size: ${it.size}` : `מידה: ${it.size}`)
                }
                if (it.sku) {
                    parts.push(isEn ? `SKU: ${it.sku}` : `מק"ט: ${it.sku}`)
                }
                parts.push(isEn ? `Qty: ${it.quantity}` : `כמות: ${it.quantity}`)
                return parts.join(' | ')
            })

            const message = `${header}\n\n${lines.join('\n')}`
            return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
        },
        [items]
    )

    const value = useMemo(
        () => ({
            items,
            totalCount,
            subtotal,
            hasPrices,
            isSupplier,
            isCartOpen,
            openCart,
            closeCart,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            buildWhatsAppQuoteUrl,
        }),
        [
            items,
            totalCount,
            subtotal,
            hasPrices,
            isSupplier,
            isCartOpen,
            openCart,
            closeCart,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            buildWhatsAppQuoteUrl,
        ]
    )

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
