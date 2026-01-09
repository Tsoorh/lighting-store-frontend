

export type FilterBy = {
    txt?: string
    price?: number
    category?:string
}

export type hebrewEnglishObj = {
    he:string
    en:string
}

export type Product = {
    _id?: string
    name: hebrewEnglishObj
    description: hebrewEnglishObj
    price: number
}

export type ProductParams = { productId: string }

type ProductSize = {
    height: number
    radius: number
}
type SocketType = {
    screwType: string
    lightType: string
}

export type FullProduct = Product & {
    category:hebrewEnglishObj[]
    imgsUrl: string[]
    size: ProductSize[]
    socketType:SocketType
    material:hebrewEnglishObj[]
    woodType:hebrewEnglishObj[]
}


export type FullProductOrNull = FullProduct | null
export type FullProductsOrNull = FullProduct[] | null