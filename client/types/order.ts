export enum OrderStatusType {
  Processing = "Processing",
  Shipped = "Shipped",
  OutForDelivery = "Out for delivery",
  Delivered = "Delivered",
}

export interface IOrder {
  _id?: string;
  shippingInfo: {
    firstName: string;
    lastName: string;
    houseNo: string;
    streetName: string;
    landMark: string;
    postalCode: string;
    city: string;
    country: string;
    state: string;
    phoneNumber: string;
  };
  orderItems: {
    _id?: string;
    name: string;
    size: string;
    quantity: number;
    image: string;
    price: number;
    product: string;
  }[];
  paymentInfo: {
    id: string;
  };
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  orderStatus?: OrderStatusType;
  createdAt?: Date;
}
