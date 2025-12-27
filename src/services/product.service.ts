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
    return await httpService.post<FullProduct, FullProduct>(`product`, product)
}
const update = async (product: FullProduct): Promise<FullProduct> => {
    return await httpService.put<FullProduct, FullProduct>(`product`, product)
}
const remove = async (productId: string): Promise<string> => {
    return await httpService.delete<string>(`product/${productId}`)
}


export const productService = {
    query,
    getById,
    add,
    update,
    remove
}