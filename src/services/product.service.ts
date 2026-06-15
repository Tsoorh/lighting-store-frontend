import type { FilterBy, FullProduct } from "../model/product.model"
import { httpService } from "./http.service"
import type { FullProductOrNull } from "../model/product.model"
import type { FullProductsOrNull } from "../model/product.model"


const query = async (filterBy: FilterBy): Promise<FullProductsOrNull> => {
    return await httpService.get<FullProductsOrNull, FilterBy>("product", filterBy)
}
const getById = async (productId: string): Promise<FullProductOrNull> => {
    return await httpService.get<FullProductOrNull>(`product/${productId}`)
}
const add = async (product: FullProduct): Promise<FullProduct> => {
    return await httpService.post<FullProduct, { product: FullProduct }>(`product`, { product })
}
const update = async (product: FullProduct): Promise<FullProduct> => {
    return await httpService.put<FullProduct, { product: FullProduct }>(`product`, { product })
}
const remove = async (productId: string): Promise<string> => {
    return await httpService.delete<string>(`product/${productId}`)
}

const downloadPriceList = async (type: 'pdf' | 'excel'): Promise<void> => {
    try {
        const timestamp = Date.now()
        const blob = await httpService.download(`product/export/${type}?t=${timestamp}`)
        
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', `price-list-${timestamp}.${type === 'pdf' ? 'pdf' : 'xlsx'}`)
        
        // Mobile Safari often requires the link to be in the DOM
        document.body.appendChild(link)
        link.click()
        
        // Cleanup with a delay to ensure the browser has triggered and finished the download
        // Mobile Safari needs the blob to stay valid until the user confirms the system prompt
        setTimeout(() => {
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        }, 10000)
    } catch (err) {
        console.error('Download failed:', err)
        throw err
    }
}


export const productService = {
    query,
    getById,
    add,
    update,
    remove,
    downloadPriceList
}