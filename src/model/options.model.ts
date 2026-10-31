export type SocketOptionCategory = 'screw' | 'light';

export interface SocketOptions {
    _id?: string;
    screwTypes: string[];
    lightTypes: string[];
    updatedAt?: string;
}

