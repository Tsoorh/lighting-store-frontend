import { httpService } from './http.service';
import type { SocketOptions, SocketOptionCategory, SiteOptions } from '../model/options.model';
import { PRODUCT_OPTIONS } from '../constants/product.constants';

const CACHE_KEY = 'tl_socket_options_cache';
const SITE_OPTIONS_CACHE_KEY = 'tl_site_options_cache';

const DEFAULT_OPTIONS: SocketOptions = {
    _id: 'socket_options',
    screwTypes: [...PRODUCT_OPTIONS.SCREW_TYPES],
    lightTypes: [...PRODUCT_OPTIONS.LIGHT_TYPES]
};

const DEFAULT_SITE_OPTIONS: SiteOptions = {
    _id: 'site_options',
    isNewCollectionActive: true
};

let inMemoryOptions: SocketOptions | null = null;
let inMemorySiteOptions: SiteOptions | null = null;

export const optionsService = {
    getSocketOptions,
    addSocketOption,
    removeSocketOption,
    getDefaultOptions,
    getSiteOptions,
    updateSiteOptions
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

async function getSiteOptions(forceRefresh = false): Promise<SiteOptions> {
    if (!forceRefresh && inMemorySiteOptions) {
        return inMemorySiteOptions;
    }

    try {
        const siteOptions = await httpService.get<SiteOptions>('options/site');
        if (siteOptions && typeof siteOptions.isNewCollectionActive === 'boolean') {
            inMemorySiteOptions = siteOptions;
            localStorage.setItem(SITE_OPTIONS_CACHE_KEY, JSON.stringify(siteOptions));
            return siteOptions;
        }
    } catch (err) {
        console.warn('Failed to fetch site options from backend, falling back to cache/default', err);
    }

    try {
        const cached = localStorage.getItem(SITE_OPTIONS_CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (typeof parsed?.isNewCollectionActive === 'boolean') {
                inMemorySiteOptions = parsed;
                return parsed;
            }
        }
    } catch (err) {
        console.warn('Failed to parse cached site options', err);
    }

    return { ...DEFAULT_SITE_OPTIONS };
}

async function updateSiteOptions(data: { isNewCollectionActive: boolean }): Promise<SiteOptions> {
    const updated = await httpService.put<SiteOptions, { isNewCollectionActive: boolean }>('options/site', data);
    inMemorySiteOptions = updated;
    localStorage.setItem(SITE_OPTIONS_CACHE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('site-options-changed', { detail: updated }));
    return updated;
}
