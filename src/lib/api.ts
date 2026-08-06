const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/v1";

export interface ApiCategory {
    _id: string;
    name: string;
    displayOrder: number;
    isActive: boolean;
    image?: string;
}

export interface CustomizationOption {
    id: string;
    name: string;
    priceAdd: number;
}

export interface CustomizationGroup {
    id: string;
    title: string;
    type: "single" | "multiple";
    required: boolean;
    options: CustomizationOption[];
}

export interface ApiProduct {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: {
        _id: string;
        name: string;
    };
    image: string;
    isActive: boolean;
    customizations: CustomizationGroup[];
}

export async function fetchCategories(): Promise<ApiCategory[]> {
    const res = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch categories");
    const json = await res.json();
    return json.data;
}

export async function fetchProducts(categoryId?: string): Promise<ApiProduct[]> {
    const url = categoryId
        ? `${API_BASE_URL}/products?category=${categoryId}`
        : `${API_BASE_URL}/products`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch products");
    const json = await res.json();
    return json.data;
}

export interface OrderItemInput {
    productId: string;
    quantity: number;
    customizations?: {
        groupId: string;
        groupTitle: string;
        options: {
            id: string;
            name: string;
            priceAdd: number;
        }[];
    }[];
}

export interface CreateOrderRequest {
    orderType: "eat-in" | "take-away";
    customerName: string;
    items: OrderItemInput[];
    paymentMethod?: "cash" | "card";
    paymentStatus?: "pending" | "paid" | "failed";
    couponCode?: string;
}

export interface CreateOrderResponse {
    success: boolean;
    data: {
        _id: string;
        orderNumber: string;
        orderType: "eat-in" | "take-away";
        customerName: string;
        items: any[];
        subtotal: number;
        tax: number;
        total: number;
        paymentMethod: string;
        paymentStatus: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
}

export async function createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create order");
    }
    const json = await res.json();
    return json;
}

export interface CreatePaymentIntentRequest {
    orderType: "eat-in" | "take-away";
    customerName: string;
    items: OrderItemInput[];
    couponCode?: string;
}

export interface CreatePaymentIntentResponse {
    clientSecret: string;
    amount: number;
}

export async function createPaymentIntent(
    request: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> {
    const res = await fetch(`${API_BASE_URL}/payments/create-intent`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create payment intent");
    }
    const json = await res.json();
    return json.data as CreatePaymentIntentResponse;
}

export interface ValidateCouponResponse {
    valid: boolean;
    reason?: string;
    discountAmount: number;
    updatedSubtotal: number;
    updatedTax: number;
    updatedTotal: number;
    coupon?: any;
}

export async function validateCoupon(
    code: string,
    subtotal: number,
    customerName?: string
): Promise<ValidateCouponResponse> {
    const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, subtotal, customerName }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to validate coupon");
    }
    const json = await res.json();
    return json.data as ValidateCouponResponse;
}