import { createContext } from 'react'
import type { CartContextValue } from '../model/cart.model'

export const CartContext = createContext<CartContextValue | null>(null)
