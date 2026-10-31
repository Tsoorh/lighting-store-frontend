import { httpService } from './http.service';
import type { SocketOptions, SocketOptionCategory } from '../model/options.model';
import { PRODUCT_OPTIONS } from '../constants/product.constants';

const CACHE_KEY = 'tl_socket_options_cache';

const DEFAULT_OPTIONS: SocketOptions = {
    _id: 'socket_options',
    screwTypes: [...PRODUCT_OPTIONS.SCREW_TYPES],
    lightTypes: [...PRODUCT_OPTIONS.LIGHT_TYPES]
};

let inMemoryOptions: SocketOptions | null = null;

export const optionsService = {
    getSocketOptions,
    addSocketOption,
    removeSocketOption,
    getDefaultOptions
};

function getDefaultOptions(): SocketOptions {
    return {
        ...DEFAULT_OPTIONS,
        screwTypes: [...DEFAULT_OPTIONS.screwTypes],
        lightTypes: [...DEFAULT_OPTIONS.lightTypes]
    };
}

function getStoredCache(): SocketOptions | null {
    try {
        const item = localStorage.getItem(CACHE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed.screwTypes) && Array.isArray(parsed.lightTypes)) {
                return parsed;
            }
        }
    } catch (err) {
        console.warn('Failed to parse cached socket options', err);
    }
    return null;
}

async function getSocketOptions(forceRefresh = false): Promise<SocketOptions> {
    if (!forceRefresh && inMemoryOptions) {
        return inMemoryOptions;
    }

    const localCached = getStoredCache();
    if (localCached && !inMemoryOptions) {
        inMemoryOptions = localCached;
    }

    try {
        const remote = await httpService.get<SocketOptions>('options/socket');
        if (remote && Array.isArray(remote.screwTypes) && Array.isArray(remote.lightTypes)) {
            inMemoryOptions = remote;
            localStorage.setItem(CACHE_KEY, JSON.stringify(remote));
            return remote;
        }
    } catch (err) {
        console.warn('Failed to fetch socket options from server, using cached/defaults', err);
    }

    return inMemoryOptions || localCached || getDefaultOptions();
}

async function addSocketOption(category: SocketOptionCategory, value: string): Promise<SocketOptions> {
    const trimmed = value.trim();
    if (!trimmed) throw new Error('Value cannot be empty');

    try {
        const res = await httpService.post<SocketOptions, { value: string }>(
            `options/socket/${category}`,
            { value: trimmed }
        );
        inMemoryOptions = res;
        localStorage.setItem(CACHE_KEY, JSON.stringify(res));
        window.dispatchEvent(new CustomEvent('socket-options-changed', { detail: res }));
        return res;
    } catch (err) {
        console.error(`Failed to add socket option for ${category}: ${trimmed}`, err);
        throw err;
    }
}

async function removeSocketOption(category: SocketOptionCategory, value: string): Promise<SocketOptions> {
    const trimmed = value.trim();
    if (!trimmed) throw new Error('Value cannot be empty');

    try {
        const res = await httpService.delete<SocketOptions, { value: string }>(
            `options/socket/${category}/${encodeURIComponent(trimmed)}`,
            { value: trimmed }
        );
        inMemoryOptions = res;
        localStorage.setItem(CACHE_KEY, JSON.stringify(res));
        window.dispatchEvent(new CustomEvent('socket-options-changed', { detail: res }));
        return res;
    } catch (err) {
        console.error(`Failed to remove socket option for ${category}: ${trimmed}`, err);
        throw err;
    }
}
