import { IOrder, IOrderAmounts, IOrderDetail } from './INewOrder';

export interface ISale {
  uuid: string;
  orderInfo: IOrder;
  orderAmounts: IOrderAmounts;
  orderDetail: IOrderDetail[];
}
