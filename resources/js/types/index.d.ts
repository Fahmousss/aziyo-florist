import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    address: string;
}

export interface PapanBunga {
    id: number;
    nama: string;
    slug: string;
    deskripsi: string;
    image:string;
    harga: number;
    is_tersedia: boolean;
    created_at: Date
    updated_at: Date
}

export interface OrderProduct {
    id: number;
    papan_bungas: PapanBunga | null;
    harga: number;
}

export interface Order {
    id: string;
    status: string;
    created_at: string;
    order_products: OrderProduct[];
    address: string;
    total_harga: number;
}


export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        admin: boolean;
        cart_count:number
    };
    ziggy: Config & { location: string };
};
