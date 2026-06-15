import { httpService } from "./http.service"
import type { LoginCredentials, Miniuser, User } from "../model/user.model"

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

async function login(credentials: LoginCredentials): Promise<Miniuser> {
    const user = await httpService.post<Miniuser, { credentials: LoginCredentials }>('auth/login', { credentials })
    if (user) _saveLocalUser(user)
    return user
}

async function register(newuser: User): Promise<Miniuser> {
    const user = await httpService.post<Miniuser, { newuser: User }>('auth/register', { newuser })
    if (user) _saveLocalUser(user)
    return user
}

async function logout(): Promise<void> {
    try {
        await httpService.post('auth/logout', null)
    } catch (err) {
        console.error('Failed to logout on backend', err)
    } finally {
        localStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        window.dispatchEvent(new Event('user-changed'))
    }
}

function getLoggedinUser(): Miniuser | null {
    const userStr = localStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)
    if (!userStr) return null
    return JSON.parse(userStr) as Miniuser
}

function _saveLocalUser(user: Miniuser) {
    localStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    window.dispatchEvent(new Event('user-changed'))
    return user
}

export const authService = { login, register, logout, getLoggedinUser }