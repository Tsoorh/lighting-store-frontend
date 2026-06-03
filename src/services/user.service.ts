import type { Miniuser, User, Role } from "../model/user.model"
import { httpService } from "./http.service"

const query = async (): Promise<Miniuser[]> => {
    return await httpService.get<Miniuser[]>("user")
}

const getById = async (userId: string): Promise<Miniuser> => {
    return await httpService.get<Miniuser>(`user/${userId}`)
}

const save = async (user: User | Miniuser): Promise<Miniuser> => {
    if (user._id) {
        return await httpService.put<Miniuser, { user: User | Miniuser }>(`user`, { user })
    } else {
        return await httpService.post<Miniuser, { user: User | Miniuser }>(`user`, { user })
    }
}

const remove = async (userId: string): Promise<string> => {
    return await httpService.delete<string>(`user/${userId}`)
}

const updateBulkMultiplier = async (role: Role, multiplier: number): Promise<{ message: string, count: number }> => {
    return await httpService.put<{ message: string, count: number }, { role: Role, multiplier: number }>(`user/bulk-multiplier`, { role, multiplier })
}

export const userService = {
    query,
    getById,
    save,
    remove,
    updateBulkMultiplier
}
