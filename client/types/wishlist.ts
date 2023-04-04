export interface IWishlist {
  user: string;
  products: {
    productId: string;
    name: string;
    price: number;
    photos: {
      id: string;
      secure_url: string;
    }[];
    size: string[];
    category: string;
  }[];

  createdAt: Date;
  updatedAt: Date;
}
