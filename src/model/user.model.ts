export type Role = 'normal' | 'admin' | 'supplier' | 'architect'

export type Miniuser = {
    _id?: string
    fullname: string
    username: string
    role?: Role
    priceMultiplier?: number
    showPrices?: boolean
}

export type LoginCredentials = {
    username: string
    password: string
}

export type User = Miniuser & {
    password?: string
}