
export interface Product {
    id?: number;
    title: string;
    price: number;
    description: string;
    category: string;
    stock: number;
    
    brand?: string;
    thumbnail?: string;
    images?: string[];
    rating?: number;
    discountPercentage?: number;
}

export interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}