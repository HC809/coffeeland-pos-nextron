import { IProduct } from '../IProduct';
import { ICategory } from '../ICategory';
import { IInvoiceRange } from '../IInvoiceRange';
import { IInvoicePoint } from '../IInvoicePoint';
import { IGeneralInfo } from '../IGeneralInfo';
import { IOrderType } from '../IOrderType';

export interface IPOSData {
  generalInfo: IGeneralInfo;
  invoicePoint: IInvoicePoint;
  invoiceRangeInUse: IInvoiceRange;
  invoiceRangePending: IInvoiceRange;
  categories: ICategory[];
  products: IProduct[];
  orderTypes: IOrderType[];
}

export interface IUpdatePOSData {
  categories: ICategory[];
  products: IProduct[];
}

export interface IUpdateInvoiceRangePOSData {
  invoiceRangeInUse: IInvoiceRange;
  invoiceRangePending: IInvoiceRange | null;
}

export interface SaveInvoiceResponse {
  itSaved: boolean;
  invoiceNumber: number;
  cai: string;
}
