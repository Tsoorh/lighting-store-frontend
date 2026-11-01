export type SocketOptionCategory = 'screw' | 'light';

export interface SocketOptions {
    _id?: string;
    screwTypes: string[];
    lightTypes: string[];
    updatedAt?: string;
}

export interface SiteOptions {
    _id?: string;
    isNewCollectionActive: boolean;
    updatedAt?: string;
}

