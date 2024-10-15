// src/app/api/sales/types.ts
export interface SaleProduct {
    productId: string;
    quantity: number;
}

export interface AddSaleRequest {
    amount: number;
    saleProducts: Array<{
        productId: string;
        quantity: number;
    }>;
    paymentMethod: string;
}
