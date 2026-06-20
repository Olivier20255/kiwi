export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  subcategories?: Category[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  color: string;
  size: string;
  priceOverride?: number;
  stockQuantity: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  variantId?: string;
  url: string;
  altText?: string;
  order: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  categoryId: string;
  isFeatured: boolean;
  isArchived: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
  reviews: Review[];
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  addresses: Address[];
}
